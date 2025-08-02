import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const pdfExportService = {
  // Export chart as PDF
  async exportChartToPDF(elementId, options = {}) {
    try {
      const {
        filename = 'chart-export.pdf',
        format = 'a4',
        orientation = 'landscape',
        quality = 0.98,
        includeMetadata = true
      } = options

      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Element not found')
      }

      // Capture the element as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png', quality)
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      })

      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add metadata if requested
      if (includeMetadata) {
        pdf.setProperties({
          title: `Excel Analytics Chart - ${new Date().toLocaleDateString()}`,
          subject: 'Data Visualization Export',
          author: 'Excel Analytics Platform',
          creator: 'Excel Analytics Platform'
        })
      }

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(filename)
      
      return { success: true, filename }
    } catch (error) {
      console.error('PDF export error:', error)
      throw new Error('Failed to export PDF: ' + error.message)
    }
  },

  // Export dashboard report as PDF
  async exportDashboardToPDF(options = {}) {
    try {
      const {
        filename = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`,
        includeCharts = true,
        includeStatistics = true,
        includeActivityFeed = true
      } = options

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPosition = 20

      // Header
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Excel Analytics Dashboard Report', 20, yPosition)
      yPosition += 15

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
      yPosition += 20

      // Statistics Section
      if (includeStatistics) {
        const statsElement = document.querySelector('.stats-section')
        if (statsElement) {
          const canvas = await html2canvas(statsElement, {
            scale: 1.5,
            backgroundColor: '#ffffff'
          })
          
          const imgData = canvas.toDataURL('image/png', 0.95)
          const imgWidth = 170
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight)
          yPosition += imgHeight + 20
        }
      }

      // Charts Section
      if (includeCharts) {
        const chartsElement = document.querySelector('.charts-section')
        if (chartsElement) {
          const canvas = await html2canvas(chartsElement, {
            scale: 1.5,
            backgroundColor: '#ffffff'
          })
          
          const imgData = canvas.toDataURL('image/png', 0.95)
          const imgWidth = 170
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          
          // Add new page if needed
          if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage()
            yPosition = 20
          }
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight)
        }
      }

      pdf.save(filename)
      return { success: true, filename }
    } catch (error) {
      console.error('Dashboard PDF export error:', error)
      throw new Error('Failed to export dashboard PDF: ' + error.message)
    }
  },

  // Export comprehensive analytics report
  async exportAnalyticsReport(chartData, aiAnalysis, options = {}) {
    try {
      const {
        filename = `analytics-report-${Date.now()}.pdf`,
        includeAIAnalysis = true,
        includeDataSummary = true
      } = options

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      let yPosition = 20
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20

      // Title
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Analytics Report', margin, yPosition)
      yPosition += 15

      // Subtitle
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition)
      yPosition += 20

      // Chart visualization
      const chartElement = document.querySelector('.chart-container')
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          scale: 1.5,
          backgroundColor: '#ffffff'
        })
        
        const imgData = canvas.toDataURL('image/png', 0.95)
        const imgWidth = pageWidth - (margin * 2)
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 20
      }

      // AI Analysis Section
      if (includeAIAnalysis && aiAnalysis) {
        // Add new page if needed
        if (yPosition > pdf.internal.pageSize.getHeight() - 60) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'bold')
        pdf.text('AI Analysis Insights', margin, yPosition)
        yPosition += 10

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')

        // Key insights
        if (aiAnalysis.keyInsights) {
          const insights = Array.isArray(aiAnalysis.keyInsights) 
            ? aiAnalysis.keyInsights 
            : [aiAnalysis.keyInsights]
          
          insights.forEach((insight, index) => {
            const text = `${index + 1}. ${insight}`
            const splitText = pdf.splitTextToSize(text, pageWidth - (margin * 2))
            pdf.text(splitText, margin, yPosition)
            yPosition += splitText.length * 4 + 5
          })
        }

        // Summary
        if (aiAnalysis.summary) {
          yPosition += 5
          pdf.setFont('helvetica', 'bold')
          pdf.text('Summary:', margin, yPosition)
          yPosition += 5
          
          pdf.setFont('helvetica', 'normal')
          const summaryText = pdf.splitTextToSize(aiAnalysis.summary, pageWidth - (margin * 2))
          pdf.text(summaryText, margin, yPosition)
        }
      }

      pdf.save(filename)
      return { success: true, filename }
    } catch (error) {
      console.error('Analytics report export error:', error)
      throw new Error('Failed to export analytics report: ' + error.message)
    }
  }
}

export default pdfExportService
