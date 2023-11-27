import QRCodeStyling from 'qr-code-styling'

/**
 * QR Code Generation Defaults
 */
const DEFAULT = {
  img: '/icon.svg',
  size: 300,
  dataColor: '#057a55',
  cornerColor: '#014737',
  bgColor: '#def7ec',
  marginFraction: 0.02,
  imgMarginFraction: 0.02
}

/**
 * Returns a QR code object
 * @param data the data to display on the QR code
 * @param options optional parameters
 * @returns
 */
export const createQrCode = (
  data: string,
  options?: {
    img?: string
    size?: number
    dataColor?: string
    cornerColor?: string
    bgColor?: string
    margin?: number
    imgMargin?: number
  }
) => {
  const size = options?.size ?? DEFAULT.size

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'svg',
    data,
    image: DEFAULT.img,
    margin: options?.margin ?? DEFAULT.marginFraction * size,
    dotsOptions: {
      type: 'rounded',
      color: options?.dataColor ?? DEFAULT.dataColor
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: options?.cornerColor ?? DEFAULT.cornerColor
    },
    cornersDotOptions: {
      color: options?.cornerColor ?? DEFAULT.cornerColor
    },
    backgroundOptions: {
      color: options?.bgColor ?? DEFAULT.bgColor
    },
    imageOptions: {
      hideBackgroundDots: true,
      margin: options?.imgMargin ?? DEFAULT.imgMarginFraction * size
    },
    qrOptions: {
      errorCorrectionLevel: 'Q'
    }
  })
}
