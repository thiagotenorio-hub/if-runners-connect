import QRCode from "qrcode";

function getRegistrationUrl(request: Request) {
  const requestUrl = new URL(request.url);
  return `${requestUrl.origin}/inscricao`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const format = requestUrl.searchParams.get("format") || "svg";
  const download = requestUrl.searchParams.get("download") === "1";
  const registrationUrl = getRegistrationUrl(request);

  if (format === "png") {
    const png = await QRCode.toBuffer(registrationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 10,
      type: "png"
    });

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        ...(download
          ? {
              "Content-Disposition":
                'attachment; filename="if-runners-inscricao-qrcode.png"'
            }
          : {})
      }
    });
  }

  const svg = await QRCode.toString(registrationUrl, {
    errorCorrectionLevel: "H",
    margin: 2,
    type: "svg",
    width: 640
  });

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      ...(download
        ? {
            "Content-Disposition":
              'attachment; filename="if-runners-inscricao-qrcode.svg"'
          }
        : {})
    }
  });
}
