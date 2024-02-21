import QRCode from 'qrcode'

export const generateQR = async (context: string, options?: QRCode.QRCodeToDataURLOptions) => {
  try {
    const _options: QRCode.QRCodeToDataURLOptions = options ?? {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 0
    }
    return await QRCode.toDataURL(context, _options)
  } catch (err) {
    console.error(err)
  }
}