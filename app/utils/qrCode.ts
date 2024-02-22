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

export const generateQRBuffer = async (context: string): Promise<Buffer | null> => {
  try {
    return new Promise((resolve, reject) => {
      QRCode.toBuffer(context, (err, buffer) => {
        if (!err) return resolve(buffer)
        reject(err)
      })
    })
  } catch (err) {
    console.error(err)
    return null
  }
}