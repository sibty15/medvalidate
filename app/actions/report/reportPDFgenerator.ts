import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { FullIdeaAnalysis } from '../fullIdeaAnalysis'

const PAGE_WIDTH = 595.28 // A4 width in points
const PAGE_HEIGHT = 841.89 // A4 height in points
const MARGIN = 50
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

interface PageContext {
  currentPage: any
  y: number
}

async function addNewPage(pdfDoc: PDFDocument, context: PageContext): Promise<void> {
  context.currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  context.y = PAGE_HEIGHT - MARGIN - 20
  
  // Draw page frame
  context.currentPage.drawRectangle({
    x: MARGIN - 10,
    y: MARGIN - 10,
    width: CONTENT_WIDTH + 20,
    height: PAGE_HEIGHT - MARGIN * 2 + 20,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.7,
  })
}

function checkPageBreak(pdfDoc: PDFDocument, context: PageContext, needed: number = 100): void {
  if (context.y - needed < MARGIN) {
    addNewPage(pdfDoc, context)
  }
}

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  if (!text || typeof text !== 'string') {
    return ['']
  }
  
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  const avgCharWidth = fontSize * 0.6 // Approximate character width (adjusted to prevent overflow)

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const estimatedWidth = testLine.length * avgCharWidth

    if (estimatedWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function drawText(
  page: any,
  text: string,
  x: number,
  y: number,
  font: any,
  size: number,
  color: { r: number; g: number; b: number },
  maxWidth?: number
): number {
  if (maxWidth) {
    const lines = wrapText(text, maxWidth, size)
    let currentY = y
    
    for (const line of lines) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font,
        color: rgb(color.r, color.g, color.b),
      })
      currentY -= size * 1.2 // Line height
    }
    
    return currentY - size * 0.3 // Additional spacing after paragraph
  } else {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
    })
    return y - size * 1.5
  }
}

export async function generatePDFBuffer(analysis: FullIdeaAnalysis): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.create()
    
    // Embed fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const context: PageContext = {
      currentPage: null as any,
      y: 0,
    }

    await addNewPage(pdfDoc, context)

    const idea = analysis.idea

    // Title
    context.y = drawText(
      context.currentPage,
      'MedValidateAI Analysis Report',
      MARGIN,
      context.y,
      boldFont,
      20,
      { r: 0, g: 0.4, b: 0.8 }
    )
    context.y -= 10

    context.y = drawText(
      context.currentPage,
      `Generated: ${new Date().toLocaleDateString()}`,
      MARGIN,
      context.y,
      regularFont,
      12,
      { r: 0.4, g: 0.4, b: 0.4 }
    )
    context.y -= 20

    // Helper functions for consistent styling
    const drawHeading = (text: string) => {
      if (!text || typeof text !== 'string') return
      checkPageBreak(pdfDoc, context, 50)
      context.y = drawText(context.currentPage, text, MARGIN, context.y, boldFont, 14, { r: 0.1, g: 0.1, b: 0.1 })
      context.y -= 5
    }

    const drawSubheading = (text: string) => {
      if (!text || typeof text !== 'string') return
      checkPageBreak(pdfDoc, context, 40)
      context.y = drawText(context.currentPage, text, MARGIN, context.y, boldFont, 11, { r: 0.2, g: 0.2, b: 0.2 })
      context.y -= 3
    }

    const drawBody = (text: string) => {
      if (!text || typeof text !== 'string') return
      checkPageBreak(pdfDoc, context, 30)
      context.y = drawText(context.currentPage, text, MARGIN, context.y, regularFont, 10, { r: 0.27, g: 0.27, b: 0.27 }, CONTENT_WIDTH)
      context.y -= 5
    }

    const drawBulletList = (items: string[]) => {
      for (const item of items) {
        checkPageBreak(pdfDoc, context, 25)
        const bulletText = `• ${item}`
        context.y = drawText(context.currentPage, bulletText, MARGIN + 15, context.y, regularFont, 10, { r: 0.27, g: 0.27, b: 0.27 }, CONTENT_WIDTH - 15)
      }
    }

    // Idea Overview
    drawHeading('Idea Overview')
    drawBody(`Title: ${idea.title}`)
    drawBody(`Category: ${idea.category || 'N/A'}`)
    drawBody(`Stage: ${idea.stage || 'N/A'}`)
    drawBody(`Domain: ${idea.domain} / ${idea.subdomain}`)
    context.y -= 5

    drawSubheading('Description')
    drawBody(idea.description)

    drawSubheading('Problem Statement')
    drawBody(idea.problem_statement)

    drawSubheading('Target Audience')
    drawBody(idea.target_audience)

    drawSubheading('Unique Value Proposition')
    drawBody(idea.unique_value_proposition)

    // Competitor Analysis
    drawHeading('Competitor Analysis')
    if (analysis.competitors.length > 0) {
      for (const comp of analysis.competitors) {
        drawSubheading(comp.competitor_name || 'Unknown Competitor')
        if (comp.competitor_description) {
          drawBody(comp.competitor_description)
        }
        if (comp.market_position) {
          drawBody(`Market Position: ${comp.market_position}`)
        }
        if (comp.funding_raised) {
          drawBody(`Funding Raised: $${comp.funding_raised.toLocaleString()}`)
        }
        if (comp.strengths) {
          const strengths = typeof comp.strengths === 'string' ? JSON.parse(comp.strengths) : comp.strengths
          if (Array.isArray(strengths) && strengths.length > 0) {
            drawBody('Strengths:')
            drawBulletList(strengths)
          }
        }
        if (comp.weaknesses) {
          const weaknesses = typeof comp.weaknesses === 'string' ? JSON.parse(comp.weaknesses) : comp.weaknesses
          if (Array.isArray(weaknesses) && weaknesses.length > 0) {
            drawBody('Weaknesses:')
            drawBulletList(weaknesses)
          }
        }
      }
    } else {
      drawBody('No competitor data available.')
    }

    // Market Data
    drawHeading('Market Data')
    if (analysis.marketData) {
      const md = analysis.marketData
      if (md.market_size_usd) {
        drawBody(`Market Size: $${md.market_size_usd.toLocaleString()}`)
      }
      if (md.market_growth_rate_percent) {
        drawBody(`Growth Rate: ${md.market_growth_rate_percent}%`)
      }
      if (md.opportunity_score) {
        drawBody(`Opportunity Score: ${md.opportunity_score}`)
      }
    } else {
      drawBody('No market data available.')
    }

    // Risk Assessment
    drawHeading('Risk Assessment')
    if (analysis.risks.length > 0) {
      for (const risk of analysis.risks) {
        drawSubheading(`${risk.risk_type}: ${risk.risk_name}`)
        if (risk.risk_description) {
          drawBody(risk.risk_description)
        }
        if (risk.probability_percent !== null && risk.probability_percent !== undefined) {
          drawBody(`Probability: ${risk.probability_percent}%`)
        }
        if (risk.impact_level) {
          drawBody(`Impact: ${risk.impact_level}`)
        }
      }
    } else {
      drawBody('No risk data available.')
    }

    // AI Insights
    drawHeading('AI Insights')
    if (analysis.aiInsights.length > 0) {
      for (const insight of analysis.aiInsights) {
        // Handle different aiInsights structure
        if (insight.market_size) {
          drawSubheading('Market Analysis')
          drawBody(`Market Size: ${insight.market_size}`)
          if (insight.growth_rate) {
            drawBody(`Growth Rate: ${insight.growth_rate}`)
          }
          if (insight.target_potential) {
            drawBody(`Target Potential: ${insight.target_potential}`)
          }
        } else if (insight.insight_type && insight.insight_category) {
          drawSubheading(`${insight.insight_type} - ${insight.insight_category}`)
          drawBody(insight.insight_content)
          if (insight.confidence_score) {
            drawBody(`Confidence: ${(insight.confidence_score * 100).toFixed(0)}%`)
          }
        }
      }
    } else {
      drawBody('No AI insights available.')
    }

    // Strategic Recommendations
    drawHeading('Strategic Recommendations')
    if (analysis.strategicRecommendations.length > 0) {
      for (const rec of analysis.strategicRecommendations) {
        drawSubheading(rec.recommendation_type)
        drawBody(rec.recommendation_content)
        if (rec.priority_level) {
          drawBody(`Priority: ${rec.priority_level}`)
        }
      }
    } else {
      drawBody('No recommendations available.')
    }

    // Customer Segments
    drawHeading('Customer Segments')
    if (analysis.customerSegments.length > 0) {
      for (const seg of analysis.customerSegments) {
        drawSubheading(seg.segment_name)
        if (seg.segment_size_estimate) {
          drawBody(`Estimated Size: ${seg.segment_size_estimate.toLocaleString()}`)
        }
        if (seg.willingness_to_pay) {
          drawBody(`Willingness to Pay: ${seg.willingness_to_pay}`)
        }
      }
    } else {
      drawBody('No customer segment data available.')
    }

    // Funding Sources
    drawHeading('Potential Funding Sources')
    if (analysis.fundingSources.length > 0) {
      const fundingNames = analysis.fundingSources.map((f) => f.name).slice(0, 5)
      drawBulletList(fundingNames)
    } else {
      drawBody('No funding source data available.')
    }

    // Footer
    checkPageBreak(pdfDoc, context, 60)
    context.y -= 20
    drawText(
      context.currentPage,
      'This report was generated by MedValidateAI. All data is for informational purposes only.',
      MARGIN,
      context.y,
      regularFont,
      9,
      { r: 0.6, g: 0.6, b: 0.6 }
    )

    const pdfBytes = await pdfDoc.save()
    return Buffer.from(pdfBytes)
  } catch (err) {
    throw err
  }
}