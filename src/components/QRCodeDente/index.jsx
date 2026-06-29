import { useMemo } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from 'antd'
import styles from './styles.module.css'

export default function QRCodeDente({ codigo, tamanho = 200, exibirCodigo = true }) {
  const elementId = useMemo(
    () => `qrcode-dente-${Math.random().toString(16).slice(2)}`,
    []
  )

  const handleImprimir = () => {
    const canvas = document.getElementById(elementId)
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return

    const imagem = canvas.toDataURL('image/png')
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Etiqueta de QR Code</title>
          <style>
            body { margin: 0; padding: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .page { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; }
            .label { width: max-content; padding: 16px; box-sizing: border-box; text-align: center; }
            .label img { display: block; margin: 0 auto; }
            .codigo { margin-top: 12px; font-size: 14px; color: #111827; letter-spacing: 0.03em; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="label">
              <img src="${imagem}" width="${tamanho}" height="${tamanho}" alt="QR Code do dente" />
              <div class="codigo">${codigo ?? '—'}</div>
            </div>
          </div>
        </body>
      </html>`

    const printWindow = window.open('', '_blank', 'width=360,height=520')
    if (!printWindow) return

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.onafterprint = () => printWindow.close()
  }

  return (
    <div className={styles.container}>
      <div className={styles.qrWrapper}>
        <QRCodeCanvas
          id={elementId}
          value={codigo ?? ''}
          size={tamanho}
          level="H"
          includeMargin={false}
        />
      </div>
      {exibirCodigo && (
        <div className={styles.codigo}>{codigo ?? '—'}</div>
      )}
      <Button
        type="primary"
        onClick={handleImprimir}
        disabled={!codigo}
        style={{ background: '#038C5A', borderColor: '#038C5A' }}
      >
        Imprimir etiqueta
      </Button>
    </div>
  )
}
