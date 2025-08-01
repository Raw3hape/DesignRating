import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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
    
    // Extract all images from FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        images.push(value)
        console.log(`API: Found image ${key}, size: ${value.size}`)
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
    "<third specific strength>",
    "<fourth specific strength if notable>"
  ],
  "improvements": [
    "<specific actionable improvement>",
    "<another specific improvement>",
    "<third specific improvement>",
    "<fourth improvement if needed>"
  ],
  "insights": [
    "<deep insight about what makes this design work or not work>",
    "<analysis of the designer's skill level and potential>",
    "<comparison to industry standards and trends>",
    "<specific advice for reaching the next level>"
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
              "The design shows solid understanding of fundamental principles",
              "There's potential for growth with more attention to details",
              "Consider studying award-winning designs for inspiration"
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
            "Design demonstrates professional approach to user interface creation. Grid usage and Material Design principles create quality product feeling.",
            "Particularly noteworthy is skillful use of micro-animations and transitions that make interface alive and responsive. This indicates deep understanding of UX principles."
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
            "This design is at the level of top design studios' work. Every element is thoughtful and serves specific purpose, creating seamless user experience.",
            "Particularly impressive is the use of space and creating emotional connection with user through visual elements. This is mature designer's work."
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
            "Design shows good understanding of basics but needs refinement to achieve premium level. Basic structure is correct.",
            "Recommended to study latest trends in interface design and apply them to enhance modernity and attractiveness of work."
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