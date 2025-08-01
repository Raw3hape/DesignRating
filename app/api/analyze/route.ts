import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { nanoid } from 'nanoid'
import { KVService } from '@/lib/kv'
import { Analysis } from '@/types'

export const maxDuration = 60 // 60 seconds timeout

// Disable body parsing to handle large files
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Database simulation for rating
// const analysisStats = {
//   totalAnalyses: 15420,
//   averageScore: 67.3,
//   scoreDistribution: {
//     '90-100': 8,
//     '80-89': 15,
//     '70-79': 25,
//     '60-69': 28,
//     '50-59': 16,
//     '0-49': 8
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Log request details for debugging
    console.log('API: Received request')
    
    let formData: FormData
    try {
      formData = await request.formData()
    } catch (error) {
      console.error('API: Error parsing formData:', error)
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
    
    const images: File[] = []
    let userEmail: string | null = null
    
    // Extract all images and email from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        images.push(value)
        console.log(`API: Found image ${key}, size: ${value.size}`)
      } else if (key === 'email' && typeof value === 'string') {
        userEmail = value
        console.log('API: Found email:', userEmail)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images for analysis' },
        { status: 400 }
      )
    }

    // Convert images to base64 for OpenAI
    const imageBase64Array = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        return `data:${image.type};base64,${base64}`
      })
    )

    // Create detailed prompt for design analysis
    const prompt = `You are an extremely critical senior design director from a top tech company (Apple, Google, Microsoft) with 20+ years of experience. Apply the highest professional standards when evaluating these works. Be very strict and demanding in your assessment.

Evaluate each aspect with extreme scrutiny:
1. Visual hierarchy and composition balance - Look for ANY misalignment or imbalance
2. Typography system and readability - Criticize ANY inconsistency or poor choices
3. Color theory application and accessibility - Deduct points for ANY accessibility issues
4. White space usage and visual breathing room - Notice ANY cramped or wasteful spacing
5. Innovation and creative solutions - Expect truly unique approaches, not clichés
6. User experience and intuitive interactions - Find ANY friction points or confusion
7. Technical execution and attention to detail - Spot EVERY pixel imperfection
8. Alignment with modern design trends - Distinguish between following and leading trends

CRITICAL Scoring guide (BE VERY STRICT):
- 85-100: Exceptional, award-winning design (less than 1% of all work) - Must be flawless AND innovative
- 70-84: Outstanding professional work (top 5%) - Near-perfect execution with unique elements
- 60-69: Very good design (top 15%) - Strong fundamentals with minor flaws
- 50-59: Average work (middle 40%) - Acceptable but forgettable
- 40-49: Below average (bottom 20%) - Clear weaknesses outweigh strengths
- 0-39: Poor quality (bottom 10%) - Fundamental issues throughout

Remember: Most professional work falls in the 50-70 range. Scores above 80 should be RARE. Be honest and strict.

IMPORTANT: Return ONLY valid JSON, no additional text. The response must be parseable JSON in this exact format:
{
  "score": <number between 1-100>,
  "category": "<Outstanding|Excellent|Good|Average|Below Average|Needs Improvement>",
  "positives": [
    "<specific positive aspect about the design>",
    "<another positive aspect>",
    "<third positive aspect>"
  ],
  "negatives": [
    "<specific negative aspect or flaw>",
    "<another negative aspect>",
    "<third negative aspect>"
  ],
  "strengths": [
    "<specific strength about the design>",
    "<another specific strength>",
    "<third specific strength>"
  ],
  "improvements": [
    "<specific actionable improvement>",
    "<another specific improvement>",
    "<third specific improvement>"
  ],
  "insights": [
    "<exactly 1 sentence analyzing what makes this design work and its core strengths>",
    "<exactly 1 sentence about the designer's skill level and potential for growth>",
    "<exactly 1 sentence with specific actionable advice for improvement>"
  ]
}`

    let analysisResult
    
    if (process.env.OPENAI_API_KEY) {
      console.log('API: Using OpenAI for analysis')
      try {
        // Real analysis via OpenAI
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                ...imageBase64Array.map(base64 => ({
                  type: "image_url" as const,
                  image_url: { url: base64, detail: "low" as const }
                }))
              ],
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
          throw new Error('No response from OpenAI')
        }

        console.log('API: OpenAI response received, length:', content.length)
        
        try {
          // Clean the content in case there's extra text
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          const jsonString = jsonMatch ? jsonMatch[0] : content
          
          analysisResult = JSON.parse(jsonString)
          
          // Validate the structure
          if (!analysisResult.score || !analysisResult.strengths || !analysisResult.improvements) {
            throw new Error('Invalid response structure')
          }
          
          console.log('API: Successfully parsed analysis result')
        } catch (parseError) {
          console.error('API: Failed to parse JSON:', parseError)
          console.log('API: Raw content:', content.substring(0, 200))
          
          // Fallback to demo analysis
          analysisResult = {
            score: 58,
            category: "Average",
            positives: [
              "Basic design principles are applied",
              "Color choices are harmonious",
              "Layout is functional"
            ],
            negatives: [
              "Lacks visual impact and memorability",
              "Typography is uninspired and basic",
              "No unique design elements or innovation"
            ],
            strengths: [
              "Clean and modern visual design",
              "Good use of color and typography",
              "Clear visual hierarchy"
            ],
            improvements: [
              "Consider adding more visual interest",
              "Improve spacing consistency",
              "Enhance interactive elements"
            ],
            insights: [
              "The design shows competent execution of basic principles but lacks the refinement and attention to detail expected at professional level.",
              "Technical skills are adequate but the work needs significant polish to compete in today's saturated design market.",
              "Study grid systems rigorously and analyze award-winning work daily to understand the gap between good and exceptional design."
            ]
          }
        }
      } catch (openAIError) {
        const errorMessage = openAIError instanceof Error ? openAIError.message : 'Unknown error'
        console.error('API: OpenAI error:', errorMessage)
        throw new Error(`OpenAI API error: ${errorMessage}`)
      }
    } else {
      // Demo analysis without OpenAI API
      const demoAnalyses = [
        {
          score: 72,
          category: "Very Good",
          positives: [
            "Clean and organized layout structure",
            "Effective use of white space",
            "Good contrast ratios for readability"
          ],
          negatives: [
            "Grid alignment issues in several sections",
            "Inconsistent spacing between elements",
            "Limited innovation in visual approach"
          ],
          strengths: [
            "Visual hierarchy is well-established with good use of size contrast",
            "Typography choices are modern and mostly consistent",
            "Color palette shows understanding of basic harmony principles"
          ],
          improvements: [
            "Several alignment issues detected in grid structure",
            "Typography scale could be more refined for better rhythm",
            "Some interactive elements lack proper hover states"
          ],
          insights: [
            "Strong execution with good attention to visual rhythm and spacing, though some refinements could elevate it to exceptional level.",
            "The designer demonstrates solid professional skills with room to push boundaries and develop a more distinctive voice.",
            "Challenge yourself with experimental projects that break conventional rules while maintaining usability to reach the next tier."
          ]
        },
        {
          score: 84,
          category: "Outstanding",
          positives: [
            "Exceptional visual storytelling and flow",
            "Sophisticated use of micro-animations",
            "Strong brand identity throughout"
          ],
          negatives: [
            "Mobile optimization could be better",
            "Some elements feel over-designed",
            "Accessibility considerations missing in places"
          ],
          strengths: [
            "Strong conceptual approach with unique problem-solving",
            "Excellent technical execution with minimal flaws",
            "Good balance between form and function"
          ],
          improvements: [
            "Minor spacing inconsistencies in mobile breakpoints",
            "Loading states could be more refined",
            "Color contrast fails WCAG AAA in two instances"
          ],
          insights: [
            "Excellent work approaching industry-leading standards with thoughtful decisions throughout, though not quite reaching the innovative edge of award winners.",
            "The designer shows mature understanding of craft with consistent execution that would succeed in most professional contexts.",
            "Push beyond safe choices by studying cutting-edge work from agencies like IDEO or Pentagram to add that final 10% of magic."
          ]
        },
        {
          score: 65,
          category: "Above Average",
          positives: [
            "Clear information architecture",
            "Functional user interface",
            "Consistent color usage"
          ],
          negatives: [
            "Typography lacks personality and hierarchy",
            "Visual design feels generic and safe",
            "Missing attention to detail in many areas"
          ],
          strengths: [
            "Basic structure follows standard conventions",
            "Navigation is functional and findable",
            "Shows understanding of fundamental design principles"
          ],
          improvements: [
            "Visual hierarchy needs significant strengthening",
            "Typography system lacks coherence and scale",
            "Overall execution feels dated and needs modernization"
          ],
          insights: [
            "Competent work that meets basic professional standards but lacks the polish and sophistication expected in competitive markets.",
            "The designer shows promise but needs significant practice and exposure to elevate beyond average execution.",
            "Dedicate time to mastering typography and grid systems - these fundamentals will transform your work from acceptable to exceptional."
          ]
        }
      ]
      
      analysisResult = demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)]
    }

    // Calculate percentile based on score (adjusted for stricter scoring)
    const calculatePercentile = (score: number): number => {
      if (score >= 85) return Math.floor(Math.random() * 4) + 96  // 96-99% (top 1%)
      if (score >= 70) return Math.floor(Math.random() * 11) + 85 // 85-95% (top 5%)
      if (score >= 60) return Math.floor(Math.random() * 15) + 70 // 70-84% (top 15%)
      if (score >= 50) return Math.floor(Math.random() * 30) + 40 // 40-69% (middle 40%)
      if (score >= 40) return Math.floor(Math.random() * 20) + 20 // 20-39% (bottom 20%)
      return Math.floor(Math.random() * 19) + 1 // 1-19% (bottom 10%)
    }

    const percentile = calculatePercentile(analysisResult.score)
    
    const getComparisonDescription = (score: number): string => {
      if (score >= 85) return "Exceptional work approaching world-class standards - extremely rare achievement!"
      if (score >= 70) return "Outstanding professional level - you're among the industry's best designers."
      if (score >= 60) return "Very strong work showing advanced skills - well above average professional standard."
      if (score >= 50) return "Average professional work - meets industry standards but needs refinement."
      if (score >= 40) return "Below professional standards - significant improvement needed to compete."
      return "Fundamental skills require development - focus on mastering basics first."
    }

    // Create URLs for images (in real project would save to cloud)
    const imageUrls = imageBase64Array

    const result = {
      score: analysisResult.score,
      category: analysisResult.category,
      insights: analysisResult.insights,
      improvements: analysisResult.improvements,
      strengths: analysisResult.strengths,
      positives: analysisResult.positives,
      negatives: analysisResult.negatives,
      images: imageUrls,
      comparison: {
        percentile,
        description: getComparisonDescription(analysisResult.score)
      }
    }

    // Save analysis data to KV if email is provided
    if (userEmail) {
      try {
        const analysisId = nanoid()
        const analysisData: Analysis = {
          id: analysisId,
          email: userEmail,
          ...result,
          createdAt: new Date().toISOString(),
          imagesCount: images.length
        }

        // Save individual analysis
        await KVService.saveAnalysis(analysisData)
        
        // Update user analysis count
        await KVService.incrementUserAnalysisCount(userEmail)
        
        // Update global stats
        await KVService.incrementGlobalStats(0, 1) // increment analysis count
        
        // Update daily stats
        const today = new Date().toISOString().split('T')[0]
        await KVService.updateDailyStats(today, userEmail)
        
        console.log('API: Analysis data saved successfully')
      } catch (saveError) {
        console.error('Error saving analysis data:', saveError)
        // Continue without failing the response
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // Return more specific error messages
    if (errorMessage.includes('OpenAI')) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please try again.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error analyzing images. Please try again with smaller images.' },
      { status: 500 }
    )
  }
}