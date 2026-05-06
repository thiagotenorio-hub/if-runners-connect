import QRCode from "qrcode";

function getConfirmationUrl(request: Request, token: string) {
  const requestUrl = new URL(request.url);
  return `${requestUrl.origin}/eventos/${token}/confirmar-presenca`;
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const requestUrl = new URL(request.url);
  const format = requestUrl.searchParams.get("format") || "svg";
  const download = requestUrl.searchParams.get("download") === "1";
  const confirmationUrl = getConfirmationUrl(request, params.token);

  if (format === "png") {
    const png = await QRCode.toBuffer(confirmationUrl, {
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
                'attachment; filename="if-runners-evento-qrcode.png"'
            }
          : {})
      }
    });
  }

  const svg = await QRCode.toString(confirmationUrl, {
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
              'attachment; filename="if-runners-evento-qrcode.svg"'
          }
        : {})
    }
  });
}
