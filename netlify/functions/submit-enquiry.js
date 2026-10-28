import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_MAIL_API_KEY);

// 👇 REPLACE WITH YOUR ACTUAL EMAILS
const RECIPIENT_EMAILS = [
//   "swingwithmeevents@gmail.com", 
"megadezins@gmail.com"
 
];

const FROM_EMAIL = "Swing With Me Events <enquiries@mail.escapeeventsgh.com>";
const LOGO_URL = "https://postimg.cc/4Kz0wsVN"; // Ensure this URL points to your live logo
const WEBSITE_URL = ""; // Your live website

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function value(data, key, fallback = "Not provided") {
  const item = data[key];
  return item === undefined ||
    item === null ||
    String(item).trim() === ""
    ? fallback
    : escapeHtml(item);
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST", "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Method not allowed." }),
    };
  }

  try {
    if (!process.env.RESEND_MAIL_API_KEY) {
      throw new Error("RESEND_MAIL_API_KEY is not configured.");
    }

    const data = JSON.parse(event.body || "{}");

    // 👇 These keys match exactly what your React EnquiryForm is sending
    const fullName = value(data, "name");
    const customerEmail = value(data, "email");
    const phoneNumber = value(data, "phone");
    const eventType = value(data, "type");
    const eventDate = value(data, "date", "Not decided yet");
    const guests = value(data, "guests", "Not sure yet");
    const venue = value(data, "venue", "Not decided yet");
    const eventVision = value(data, "message");

    const replyTo =
      data["email"] && String(data["email"]).includes("@")
        ? String(data["email"]).trim()
        : undefined;

    const replyLink = replyTo
      ? `mailto:${encodeURIComponent(replyTo)}?subject=${encodeURIComponent(
          `Re: Your Swing With Me enquiry`
        )}`
      : WEBSITE_URL;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAILS,
      replyTo,
      subject: `New Enquiry: ${eventType} from ${fullName}`,

      html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New Enquiry</title>
          </head>
          <body style="margin:0; padding:0; background:#14050f; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#ffffff;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#14050f;">
              <tr>
                <td align="center" style="padding:40px 12px;">
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px; background:#1d0817; border-radius:24px; overflow:hidden; border:1px solid rgba(254,78,218,0.3); box-shadow:0 20px 50px rgba(0,0,0,0.5);">
                    
                    <!-- HEADER -->
                    <tr>
                      <td align="center" style="padding:40px 28px; background:#14050f; border-bottom:1px solid rgba(255,255,255,0.08);">
                        <img src="${LOGO_URL}" alt="Swing With Me Events" width="120" style="display:block; width:120px; max-width:100%; height:auto; margin:0 auto 20px; border:0;" />
                        <div style="font-size:11px; line-height:18px; letter-spacing:3px; text-transform:uppercase; color:#fe4eda; font-weight:bold;">
                          New Enquiry
                        </div>
                        <h1 style="margin:10px 0 0; font-family:Georgia, serif; font-size:32px; line-height:40px; color:#ffffff; font-weight:normal;">
                          Shall we make <em style="color:#fe4eda;">something lovely?</em>
                        </h1>
                      </td>
                    </tr>

                    <!-- CLIENT INFORMATION -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#fe4eda; font-weight:bold; margin-bottom:10px;">
                          Client Details
                        </div>
                        <h2 style="margin:0 0 20px; font-family:Georgia, serif; font-size:24px; color:#ffffff;">
                          ${fullName}
                        </h2>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px;">
                          <tr>
                            <td style="padding:20px; border-bottom:1px solid rgba(255,255,255,0.1);">
                              <div style="font-size:11px; color:#a39ba1; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Email</div>
                              <div style="font-size:15px; color:#ffffff;">${customerEmail}</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px;">
                              <div style="font-size:11px; color:#a39ba1; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">Phone / WhatsApp</div>
                              <div style="font-size:15px; color:#ffffff;">${phoneNumber}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- EVENT DETAILS -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#fe4eda; font-weight:bold; margin-bottom:10px;">
                          Event Details
                        </div>
                        <h2 style="margin:0 0 20px; font-family:Georgia, serif; font-size:24px; color:#ffffff;">
                          ${eventType}
                        </h2>

                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:16px; overflow:hidden;">
                          <tr>
                            <td width="42%" style="padding:15px 18px; border-bottom:1px solid rgba(255,255,255,0.1); color:#a39ba1; font-size:13px;">Date</td>
                            <td style="padding:15px 18px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:14px; font-weight:bold; color:#fe4eda;">${eventDate}</td>
                          </tr>
                          <tr>
                            <td style="padding:15px 18px; border-bottom:1px solid rgba(255,255,255,0.1); color:#a39ba1; font-size:13px;">Guests</td>
                            <td style="padding:15px 18px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:14px; font-weight:bold;">${guests}</td>
                          </tr>
                          <tr>
                            <td style="padding:15px 18px; color:#a39ba1; font-size:13px;">Venue / Location</td>
                            <td style="padding:15px 18px; font-size:14px; font-weight:bold;">${venue}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- EVENT VISION -->
                    <tr>
                      <td style="padding:32px 32px 0;">
                        <div style="font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#fe4eda; font-weight:bold; margin-bottom:10px;">
                          The Vision
                        </div>
                        <div style="padding:22px; background:rgba(254,78,218,0.08); border-left:4px solid #fe4eda; border-radius:0 16px 16px 0; font-size:15px; line-height:1.6; color:#e0d8de; font-style:italic;">
                          "${eventVision}"
                        </div>
                      </td>
                    </tr>

                    <!-- REPLY BUTTON -->
                    <tr>
                      <td align="center" style="padding:40px 32px;">
                        <a href="${replyLink}" style="display:inline-block; background:#fe4eda; color:#1a0614; text-decoration:none; padding:16px 32px; border-radius:50px; font-size:14px; font-weight:bold; letter-spacing:0.5px; box-shadow:0 10px 20px rgba(254,78,218,0.3);">
                          Reply to ${fullName}
                        </a>
                        <p style="margin:16px 0 0; font-size:12px; line-height:19px; color:#a39ba1;">
                          Clicking this button will open a reply email addressed to the client.
                        </p>
                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td align="center" style="padding:24px 28px; background:#14050f; border-top:1px solid rgba(255,255,255,0.08); color:#a39ba1;">
                        <p style="margin:0 0 8px; font-size:12px; line-height:19px;">
                          This enquiry was submitted through Swing With Me Events.
                        </p>
                        <a href="${WEBSITE_URL}" style="color:#fe4eda; text-decoration:none; font-size:12px;">
                          swingwithme.events
                        </a>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: "The email could not be sent.",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Enquiry function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Something went wrong while sending the inquiry.",
      }),
    };
  }
};