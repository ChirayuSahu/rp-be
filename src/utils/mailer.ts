import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendOrderStatusEmail(
  to: string,
  data: {
    name: string;
    invType: string;
    invNo: string;
    status: string;
  }
) {
  const mailOptions = {
    from: `"Order Status - Rajesh Pharma" <orders@rajeshpharma.com>`,
    to,
    subject: `Order Status Update for ${data.invType}-${data.invNo}`,
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Status</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="padding:18px; text-align:center; background:#12A704; color:#ffffff;">
                <h1 style="margin:0; font-size:18px; font-weight:bold;">
                  Rajesh Pharma
                </h1>
                <p style="margin:6px 0 0; font-size:13px;">
                  Order Status Update
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:24px; color:#333333;">

                <!-- Customer Name -->
                <p style="margin:0 0 14px; font-size:14px;">
                  Hello <strong>${data.name}</strong>,
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb; border-radius:4px;">
                  <tr>
                    <td style="padding:14px; font-size:14px;">
                      <strong>Invoice:</strong> ${data.invType}-${data.invNo}
                    </td>
                  </tr>
                  <tr style="background:#f9fafb;">
                    <td style="padding:14px; font-size:14px;">
                      <strong>Order Status:</strong>
                      <span style="color:#12A704; font-weight:bold;">
                        ${data.status}
                      </span>
                    </td>
                  </tr>
                </table>

                <p style="margin:20px 0 0; font-size:13px; color:#6b7280;">
                  Thank you for choosing Rajesh Pharma.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:12px; text-align:center; font-size:12px; color:#6b7280; background:#f9fafb;">
                © ${new Date().getFullYear()} Rajesh Pharma
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
}
