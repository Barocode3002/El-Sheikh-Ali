import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import PurchaseReceiptEmail from "@/email/PurchaseReceipt"

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    return new NextResponse("Stripe not configured", { status: 500 })
  }

  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )

  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const email = charge.billing_details.email
    const pricePaidInPiasters = charge.amount

    const product = await db.product.findUnique({ where: { id: productId } })
    if (product == null || email == null) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    // Check stock availability
    if (product.stockQuantity <= 0) {
      return new NextResponse("Product out of stock", { status: 400 })
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInPiasters } },
    }

    // Create order and decrement stock in a transaction
    const result = await db.$transaction(async (tx) => {
      const {
        orders: [order],
      } = await tx.user.upsert({
        where: { email },
        create: userFields,
        update: userFields,
        select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
      })

      await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { decrement: 1 } }
      })

      return order
    })

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    if (resend) {
      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmail
            order={result}
            product={product}
            downloadVerificationId={downloadVerification.id}
          />
        ),
      })
    } else {
      console.warn("RESEND_API_KEY not configured - email not sent")
    }
  }

  return new NextResponse()
}
