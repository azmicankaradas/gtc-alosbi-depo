import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface StockOutReceiptData {
    documentCode: string
    date: string
    requesterName: string
    items: {
        productCode?: string
        productName: string
        brandModel: string
        categoryType: string
        sizeColor: string
        quantity: number
        unit?: string
        unitPrice?: number
        totalPrice?: number
    }[]
    systemUser?: string
    sourceWarehouse?: string
    targetWarehouse?: string
}

/**
 * Helper function to convert Turkish characters to ASCII equivalents
 * for PDF display (jsPDF default fonts don't support Turkish chars)
 */
function toAscii(text: string): string {
    const turkishChars: Record<string, string> = {
        'ğ': 'g', 'Ğ': 'G',
        'ü': 'u', 'Ü': 'U',
        'ş': 's', 'Ş': 'S',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ç': 'c', 'Ç': 'C'
    }
    return text.replace(/[ğĞüÜşŞıİöÖçÇ]/g, char => turkishChars[char] || char)
}

/**
 * GTC Endüstriyel - Stok Transfer Fisi
 * Professional PDF format matching company standard
 */
export function generateStockOutReceipt(data: StockOutReceiptData): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15

    // ============================================================
    // HEADER SECTION - Logo and Title
    // ============================================================

    // GTC Logo Text (simulating the logo)
    doc.setFontSize(28)
    doc.setTextColor(0, 128, 128) // Teal color
    doc.setFont('helvetica', 'bold')
    doc.text('GTC', margin, 20)

    doc.setFontSize(16)
    doc.setTextColor(0, 128, 128)
    doc.text('Endustriyel', margin, 28)

    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('GTC Endustriyel Urunler San. ve Tic. A.S.', margin, 33)

    // Main Title - Stok Transfer Fisi
    doc.setFontSize(18)
    doc.setTextColor(0, 128, 128)
    doc.setFont('helvetica', 'bold')
    doc.text('Stok Transfer Fisi', pageWidth / 2, 18, { align: 'center' })

    // ============================================================
    // INFO SECTION - Two Column Layout (FIXED POSITIONING)
    // Left column: company info (narrower)
    // Right column: document info (positioned far right)
    // ============================================================

    const infoStartY = 45
    const leftColX = margin
    const leftLabelWidth = 32
    const leftValueX = margin + leftLabelWidth + 2
    const lineHeight = 6

    // Right column positioned at the far right
    const rightLabelWidth = 28
    const rightColX = pageWidth - margin - 55  // Position for labels
    const rightValueX = pageWidth - margin - 25  // Position for values

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(51, 51, 51)

    // Left Column Labels
    doc.text('Firma', leftColX, infoStartY)
    doc.text('Isyeri', leftColX, infoStartY + lineHeight)
    doc.text(toAscii('Cikan Depo'), leftColX, infoStartY + lineHeight * 2)
    doc.text('Giren Depo', leftColX, infoStartY + lineHeight * 3)
    doc.text(toAscii('Satis Temsilcisi'), leftColX, infoStartY + lineHeight * 4)

    // Left column colons
    doc.setFont('helvetica', 'normal')
    doc.text(':', leftValueX - 5, infoStartY)
    doc.text(':', leftValueX - 5, infoStartY + lineHeight)
    doc.text(':', leftValueX - 5, infoStartY + lineHeight * 2)
    doc.text(':', leftValueX - 5, infoStartY + lineHeight * 3)
    doc.text(':', leftValueX - 5, infoStartY + lineHeight * 4)

    // Left Column Values - truncated to fit
    doc.setFontSize(7)
    doc.text('GTC ENDUSTRIYEL URUNLER SAN. VE TIC. A.S.', leftValueX, infoStartY)
    doc.text('GTC ENDUSTRIYEL URUNLER SAN. VE TIC. A.S.', leftValueX, infoStartY + lineHeight)
    doc.text(toAscii(data.sourceWarehouse || 'ALIOSB'), leftValueX, infoStartY + lineHeight * 2)
    doc.text(toAscii(data.targetWarehouse || 'MAGAZA DEPO'), leftValueX, infoStartY + lineHeight * 3)
    doc.text(toAscii(data.requesterName || 'Depo Yetkilisi'), leftValueX, infoStartY + lineHeight * 4)

    // Right Column - Document Info (Clear separation)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Belge No', rightColX, infoStartY)
    doc.text('Belge Tarihi', rightColX, infoStartY + lineHeight)

    doc.setFont('helvetica', 'normal')
    doc.text(':', rightValueX - 3, infoStartY)
    doc.text(':', rightValueX - 3, infoStartY + lineHeight)

    doc.text(data.documentCode, rightValueX, infoStartY)
    doc.text(data.date, rightValueX, infoStartY + lineHeight)

    // ============================================================
    // PRODUCT TABLE
    // ============================================================

    const tableStartY = infoStartY + lineHeight * 6

    // Prepare table data
    const tableData = data.items.map((item) => [
        item.productCode || '',
        toAscii(item.productName),
        toAscii(item.brandModel || 'STANDART'),
        toAscii(item.categoryType || 'STANDART'),
        toAscii(item.sizeColor || ''),
        item.quantity.toString(),
        item.unit || 'ADET',
        (item.unitPrice || 0).toFixed(2),
        (item.totalPrice || 0).toFixed(2)
    ])

    autoTable(doc, {
        startY: tableStartY,
        head: [[
            'Stok Kodu',
            toAscii('Urun Adi'),
            'Ozellik 1',
            'Ozellik 2',
            'Beden',
            'Miktar',
            'Birim',
            'Birim Fiyat',
            'Tutar'
        ]],
        body: tableData,
        theme: 'plain',
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [51, 51, 51],
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'left',
            lineWidth: 0,
            cellPadding: { top: 3, right: 2, bottom: 3, left: 2 }
        },
        bodyStyles: {
            textColor: [51, 51, 51],
            fontSize: 8,
            halign: 'left',
            cellPadding: { top: 2, right: 2, bottom: 2, left: 2 }
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 45 },
            2: { cellWidth: 22 },
            3: { cellWidth: 22 },
            4: { cellWidth: 12, halign: 'center' },
            5: { cellWidth: 15, halign: 'right' },
            6: { cellWidth: 12, halign: 'center' },
            7: { cellWidth: 18, halign: 'right' },
            8: { cellWidth: 18, halign: 'right' }
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
            // Draw header line under column headers
            const headerY = data.table?.head?.[0]?.cells?.[0]?.y
            if (headerY) {
                doc.setDrawColor(200, 200, 200)
                doc.setLineWidth(0.3)
                const lineY = headerY + 6
                doc.line(margin, lineY, pageWidth - margin, lineY)
            }
        },
        didDrawCell: (data) => {
            // Draw bottom border for each row
            if (data.section === 'body') {
                doc.setDrawColor(230, 230, 230)
                doc.setLineWidth(0.2)
                const y = data.cell.y + data.cell.height
                doc.line(margin, y, pageWidth - margin, y)
            }
        }
    })

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 150

    // ============================================================
    // TOTALS SECTION
    // ============================================================

    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)
    const totalAmount = data.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(51, 51, 51)

    const totalsY = finalY + 10
    doc.text('Toplam Miktar:', pageWidth - margin - 80, totalsY)
    doc.text(totalQuantity.toString(), pageWidth - margin - 40, totalsY)
    doc.text('ADET', pageWidth - margin - 30, totalsY)

    if (totalAmount > 0) {
        doc.text('Toplam Tutar:', pageWidth - margin - 80, totalsY + 7)
        doc.text(totalAmount.toFixed(2), pageWidth - margin - 30, totalsY + 7)
    }

    // ============================================================
    // SIGNATURE SECTION
    // ============================================================

    const signatureY = finalY + 45

    doc.setTextColor(51, 51, 51)
    doc.setDrawColor(150, 150, 150)

    // Left signature box - Teslim Alan (Receiver)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TESLIM ALAN', margin + 30, signatureY, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(toAscii(data.requesterName), margin + 30, signatureY + 8, { align: 'center' })

    doc.line(margin, signatureY + 25, margin + 60, signatureY + 25)
    doc.setFontSize(8)
    doc.text('Imza / Tarih', margin + 30, signatureY + 32, { align: 'center' })

    // Right signature box - Teslim Eden (Deliverer)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TESLIM EDEN', pageWidth - margin - 30, signatureY, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(toAscii(data.systemUser || 'Depo Yetkilisi'), pageWidth - margin - 30, signatureY + 8, { align: 'center' })

    doc.line(pageWidth - margin - 60, signatureY + 25, pageWidth - margin, signatureY + 25)
    doc.setFontSize(8)
    doc.text('Imza / Tarih', pageWidth - margin - 30, signatureY + 32, { align: 'center' })

    // ============================================================
    // FOOTER
    // ============================================================

    doc.setFontSize(7)
    doc.setTextColor(128, 128, 128)
    doc.text(
        'Bu belge GTC Endustriyel Depo Yonetim Sistemi tarafindan otomatik olarak olusturulmustur.',
        pageWidth / 2,
        285,
        { align: 'center' }
    )

    doc.text(
        `Olusturulma: ${new Date().toLocaleString('tr-TR')}`,
        pageWidth / 2,
        290,
        { align: 'center' }
    )

    return doc
}

/**
 * Generates a unique document code for stock out receipts
 * Format: STK-YYYYMMDD-XXXX (e.g., STK-20260126-A1B2)
 */
export function generateDocumentCode(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `STK-${dateStr}-${randomPart}`
}

/**
 * Downloads the PDF with a proper filename
 */
export function downloadReceipt(doc: jsPDF, documentCode: string): void {
    doc.save(`${documentCode}.pdf`)
}
