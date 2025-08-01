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
    const prompt = `You are a senior design director from a top tech company (Apple, Google, Microsoft). Analyze these design works professionally.

Evaluate each aspect carefully:
1. Visual hierarchy and composition balance
2. Typography system and readability
3. Color theory application and accessibility
4. White space usage and visual breathing room
5. Innovation and creative solutions
6. User experience and intuitive interactions
7. Technical execution and attention to detail
8. Alignment with modern design trends

Scoring guide:
- 90-100: World-class design (Apple, Google design awards level)
- 80-89: Excellent professional work
- 70-79: Good design with solid fundamentals
- 60-69: Average with room for improvement
- Below 60: Needs significant improvement

IMPORTANT: Return ONLY valid JSON, no additional text. The response must be parseable JSON in this exact format:
{
  "score": <number between 1-100>,
  "category": "<Outstanding|Excellent|Good|Average|Below Average|Needs Improvement>",
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
            score: 75,
            category: "Good",
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
              "The design demonstrates solid fundamental principles with clean visual hierarchy and thoughtful composition that creates an effective user experience.",
              "The designer shows promising technical skills and aesthetic understanding with strong potential for continued growth in the field.",
              "Focus on developing a distinctive style by studying how leading designers inject personality while maintaining usability - your foundation is strong."
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
          score: 87,
          category: "Excellent",
          strengths: [
            "Outstanding composition with clear visual hierarchy",
            "Modern and stylish typography, excellent readability",
            "Harmonious color palette with proper accents"
          ],
          improvements: [
            "Add more breathing room between elements for better perception",
            "Consider increasing contrast for some text elements",
            "Optimize CTA element placement for better conversion"
          ],
          insights: [
            "The design demonstrates professional maturity with excellent grid systems, visual rhythm, and spacing that creates a premium product feeling.",
            "Particularly impressive is the skillful use of micro-animations and restraint in motion design, showing deep UX understanding that separates good designers from great ones.",
            "To elevate further, explore experimental color combinations and unique layout structures studied from agencies like Fantasy or Pentagram to develop your signature style."
          ]
        },
        {
          score: 93,
          category: "Outstanding",
          strengths: [
            "Innovative approach to solving user tasks",
            "Flawless technical execution and attention to detail",
            "Perfect balance of functionality and aesthetics"
          ],
          improvements: [
            "Consider adaptation for different screen sizes",
            "Add states for interactive elements",
            "Conduct accessibility testing for users with disabilities"
          ],
          insights: [
            "This design reaches the level of top design studios with every element serving a specific purpose in creating a seamless user experience.",
            "Particularly impressive is the masterful use of space and visual elements that create genuine emotional connection with users.",
            "Consider expanding your portfolio with experimental projects to showcase this exceptional skill level to potential clients or employers."
          ]
        },
        {
          score: 76,
          category: "Good",
          strengths: [
            "Clear structure and logical navigation",
            "Appropriate use of graphic elements",
            "Compliance with basic UX principles"
          ],
          improvements: [
            "Improve visual hierarchy through sizes and contrasts",
            "Update color palette according to modern trends",
            "Add more dynamics through animations and micro-interactions"
          ],
          insights: [
            "The design shows good understanding of fundamentals but needs refinement in visual hierarchy and modern aesthetics to reach premium level.",
            "Your technical foundation is solid with clear potential for growth through studying contemporary design trends and best practices.",
            "Study award-winning designs on Behance and Dribbble daily, then practice recreating elements to build your visual vocabulary."
          ]
        }
      ]
      
      analysisResult = demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)]
    }

    // Calculate percentile based on score
    const calculatePercentile = (score: number): number => {
      if (score >= 90) return Math.floor(Math.random() * 8) + 92 // 92-99%
      if (score >= 80) return Math.floor(Math.random() * 15) + 77 // 77-91%
      if (score >= 70) return Math.floor(Math.random() * 25) + 52 // 52-76%
      if (score >= 60) return Math.floor(Math.random() * 28) + 24 // 24-51%
      if (score >= 50) return Math.floor(Math.random() * 16) + 8  // 8-23%
      return Math.floor(Math.random() * 8) + 1 // 1-7%
    }

    const percentile = calculatePercentile(analysisResult.score)
    
    const getComparisonDescription = (score: number): string => {
      if (score >= 90) return "Your work is at the level of world's best designers!"
      if (score >= 80) return "Excellent result! You're among top professional designers."
      if (score >= 70) return "Good level! There's potential for growth."
      if (score >= 60) return "Average result with good improvement prospects."
      return "There's work to be done, but you have basic skills."
    }

    // Create URLs for images (in real project would save to cloud)
    const imageUrls = imageBase64Array

    const result = {
      score: analysisResult.score,
      category: analysisResult.category,
      insights: analysisResult.insights,
      improvements: analysisResult.improvements,
      strengths: analysisResult.strengths,
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