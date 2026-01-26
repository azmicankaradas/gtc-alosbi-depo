import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface StockOutReceiptData {
    documentCode: string
    date: string
    requesterName: string
    items: {
        productName: string
        brandModel: string
        categoryType: string
        sizeColor: string
        quantity: number
    }[]
    systemUser?: string
}

/**
 * Generates a professional PDF receipt for stock out transactions
 * "Stok Teslim Fişi" - Stock Delivery Receipt
 */
export function generateStockOutReceipt(data: StockOutReceiptData): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20

    // ============================================================
    // HEADER SECTION
    // ============================================================

    // Company Header
    doc.setFillColor(16, 185, 129) // Emerald-500
    doc.rect(0, 0, pageWidth, 35, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('GTC Endüstriyel', pageWidth / 2, 18, { align: 'center' })

    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('STOK TESLİM FİŞİ', pageWidth / 2, 28, { align: 'center' })

    // ============================================================
    // TRANSACTION DETAILS SECTION
    // ============================================================

    doc.setTextColor(51, 51, 51)

    // Document Info Box
    doc.setFillColor(248, 250, 252) // Slate-50
    doc.roundedRect(margin, 45, pageWidth - (margin * 2), 30, 3, 3, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Fiş No:', margin + 5, 55)
    doc.text('Tarih:', margin + 5, 65)
    doc.text('Talep Eden:', pageWidth / 2, 55)

    doc.setFont('helvetica', 'normal')
    doc.text(data.documentCode, margin + 25, 55)
    doc.text(data.date, margin + 25, 65)
    doc.text(data.requesterName, pageWidth / 2 + 25, 55)

    // ============================================================
    // PRODUCT TABLE
    // ============================================================

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('ÜRÜN BİLGİLERİ', margin, 90)

    const tableData = data.items.map((item, index) => [
        (index + 1).toString(),
        item.productName,
        item.brandModel,
        item.categoryType,
        item.sizeColor,
        item.quantity.toString()
    ])

    autoTable(doc, {
        startY: 95,
        head: [[
            '#',
            'Ürün Adı',
            'Marka / Model',
            'Kategori / Tür',
            'Beden / Renk',
            'Adet'
        ]],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [30, 41, 59], // Slate-800
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 9
        },
        bodyStyles: {
            textColor: [51, 51, 51],
            fontSize: 9,
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { halign: 'left', cellWidth: 45 },
            2: { halign: 'center', cellWidth: 30 },
            3: { halign: 'center', cellWidth: 30 },
            4: { halign: 'center', cellWidth: 30 },
            5: { halign: 'center', cellWidth: 15 }
        },
        margin: { left: margin, right: margin },
        alternateRowStyles: {
            fillColor: [248, 250, 252] // Slate-50
        }
    })

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 150

    // ============================================================
    // TOTAL QUANTITY
    // ============================================================

    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)

    doc.setFillColor(16, 185, 129, 0.1) // Emerald with opacity
    doc.roundedRect(pageWidth - margin - 60, finalY + 5, 60, 15, 2, 2, 'F')

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Toplam:', pageWidth - margin - 55, finalY + 14)
    doc.setTextColor(16, 185, 129)
    doc.text(`${totalQuantity} ADET`, pageWidth - margin - 20, finalY + 14)

    // ============================================================
    // SIGNATURE SECTION
    // ============================================================

    const signatureY = finalY + 45

    doc.setTextColor(51, 51, 51)
    doc.setDrawColor(200, 200, 200)

    // Left signature box - Teslim Alan (Receiver)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TESLİM ALAN', margin + 30, signatureY, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(data.requesterName, margin + 30, signatureY + 8, { align: 'center' })

    doc.line(margin, signatureY + 25, margin + 60, signatureY + 25)
    doc.setFontSize(8)
    doc.text('İmza', margin + 30, signatureY + 32, { align: 'center' })

    // Right signature box - Teslim Eden (Deliverer)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('TESLİM EDEN', pageWidth - margin - 30, signatureY, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(data.systemUser || 'Depo Yetkilisi', pageWidth - margin - 30, signatureY + 8, { align: 'center' })

    doc.line(pageWidth - margin - 60, signatureY + 25, pageWidth - margin, signatureY + 25)
    doc.setFontSize(8)
    doc.text('İmza', pageWidth - margin - 30, signatureY + 32, { align: 'center' })

    // ============================================================
    // FOOTER
    // ============================================================

    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
        'Bu fiş GTC Endüstriyel Depo Yönetim Sistemi tarafından otomatik olarak oluşturulmuştur.',
        pageWidth / 2,
        285,
        { align: 'center' }
    )

    doc.text(
        `Oluşturulma: ${new Date().toLocaleString('tr-TR')}`,
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
