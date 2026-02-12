'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QuizResult } from '@/types'
import { Award, CheckCircle, XCircle, Download, RotateCcw, Trophy } from 'lucide-react'

interface QuizResultsScreenProps {
  result: QuizResult
  quizTitle: string
  settings: {
    showCorrectAnswers: boolean
    showScore: boolean
    allowRetake: boolean
  }
  onRetake?: () => void
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
  }
}

export function QuizResultsScreen({
  result,
  quizTitle,
  settings,
  onRetake,
  theme,
}: QuizResultsScreenProps) {
  const passed = result.passed

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="w-full max-w-3xl">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center animate-scale-in"
            style={{ backgroundColor: passed ? '#3d5948' : '#770a19' }}
          >
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: theme.textColor }}>
            {passed ? 'Congratulations!' : 'Quiz Complete'}
          </h1>
          <p className="text-xl" style={{ color: theme.textColor, opacity: 0.7 }}>
            {passed ? 'You passed the quiz!' : 'Keep practicing!'}
          </p>
        </div>

        {/* Score Card */}
        {settings.showScore && (
          <Card 
            className="mb-6 border-4"
            style={{ 
              backgroundColor: 'white',
              borderColor: passed ? '#3d5948' : '#770a19'
            }}
          >
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-sm mb-2" style={{ color: '#3d5948' }}>Score</p>
                  <p className="text-4xl font-bold" style={{ color: theme.textColor }}>
                    {result.score}%
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-2" style={{ color: '#3d5948' }}>Points</p>
                  <p className="text-4xl font-bold" style={{ color: theme.textColor }}>
                    {result.earnedPoints}/{result.totalPoints}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-2" style={{ color: '#3d5948' }}>Correct</p>
                  <p className="text-4xl font-bold" style={{ color: theme.textColor }}>
                    {result.correctAnswers}/{result.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-2" style={{ color: '#3d5948' }}>Time</p>
                  <p className="text-4xl font-bold" style={{ color: theme.textColor }}>
                    {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full h-4 rounded-full" style={{ backgroundColor: '#e8e4db' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${result.score}%`,
                      backgroundColor: passed ? '#3d5948' : '#770a19'
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Answers Review */}
        {settings.showCorrectAnswers && (
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.textColor }}>
                Answer Review
              </h2>
              <div className="space-y-4">
                {result.answers.map((answer, index) => (
                  <div 
                    key={answer.questionId}
                    className="p-4 rounded-lg border-2"
                    style={{ 
                      borderColor: answer.isCorrect ? '#3d5948' : '#e8e4db',
                      backgroundColor: answer.isCorrect ? '#3d594810' : 'white'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2" style={{ color: theme.textColor }}>
                          Question {index + 1}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: theme.textColor, opacity: 0.8 }}>
                          Your answer: <span className="font-medium">{answer.value}</span>
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm mb-2 text-green-700">
                            Correct answer: <span className="font-medium">...</span>
                          </p>
                        )}
                        {answer.explanation && (
                          <p className="text-sm mt-2 p-3 rounded" style={{ backgroundColor: '#f4f2ed', color: '#3d5948' }}>
                            💡 {answer.explanation}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span 
                            className="text-xs font-bold px-2 py-1 rounded"
                            style={{ 
                              backgroundColor: answer.isCorrect ? '#3d5948' : '#770a19',
                              color: 'white'
                            }}
                          >
                            {answer.pointsEarned} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {settings.allowRetake && onRetake && (
            <Button
              onClick={onRetake}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
          )}
          {result.certificateUrl && (
            <Button
              size="lg"
              className="gap-2 text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Download className="w-4 h-4" />
              Download Certificate
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: theme.textColor, opacity: 0.4 }}>
            Powered by <span className="font-semibold">Stoneforms</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
