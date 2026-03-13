import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { ContactFormEmail } from "@/components/emails/contact-form-email";
import { z } from "zod";
import * as React from "react";

import { render } from "@react-email/render";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the data
    const validatedData = contactSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.flatten().fieldErrors, success: false },
        { status: 400 }
      );
    }

    const { name, email, message } = validatedData.data;

    const emailHtml = await render(ContactFormEmail({ name, email, message }) as React.ReactElement);

    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["oussemabenyahia89@gmail.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later.", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Your message has been sent successfully!" 
    });
  } catch (err) {
    console.error("Contact API Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again.", success: false },
      { status: 500 }
    );
  }
}
