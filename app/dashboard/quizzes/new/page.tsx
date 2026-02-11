'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuizQuestion, QuizSettings } from '@/types'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Award,
  Clock,
  Shuffle,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react'

export default function QuizBuilderPage() {
  const [quizTitle, setQuizTitle] = useState('My Quiz')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [settings, setSettings] = useState<QuizSettings>({
    passingScore: 70,
    showCorrectAnswers: true,
    showScore: true,
    allowRetake: true,
    timeLimit: 0,
    randomizeQuestions: false,
    randomizeChoices: false,
  })

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      type: 'multiple_choice',
      label: 'Question ' + (questions.length + 1),
      required: true,
      points: 10,
      order: questions.length,
      choices: [
        { id: '1', label: 'Option A', value: 'a' },
        { id: '2', label: 'Option B', value: 'b' },
        { id: '3', label: 'Option C', value: 'c' },
        { id: '4', label: 'Option D', value: 'd' },
      ],
      correctAnswer: 'a',
      explanation: 'Explanation for the correct answer...',
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f2ed' }}>
      {/* Top Bar */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6" style={{ borderColor: '#e8e4db' }}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quizzes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="border-l h-6" style={{ borderColor: '#e8e4db' }}></div>
          <div>
            <Input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
              style={{ color: '#142c1c' }}
            />
            <p className="text-xs" style={{ color: '#3d5948' }}>
              {questions.length} questions • {totalPoints} total points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button size="sm" className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Save className="w-4 h-4" />
            Save Quiz
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: '#142c1c' }}>Questions</h2>
              <Button onClick={addQuestion} className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
                <CardContent className="p-12 text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" style={{ color: '#3d5948' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#142c1c' }}>
                    No questions yet
                  </h3>
                  <p className="mb-6" style={{ color: '#3d5948' }}>
                    Add your first quiz question to get started
                  </p>
                  <Button onClick={addQuestion} className="text-white" style={{ backgroundColor: '#142c1c' }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Question
                  </Button>
                </CardContent>
              </Card>
            ) : (
              questions.map((question, index) => (
                <Card key={question.id} style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            style={{ backgroundColor: '#142c1c' }}
                          >
                            {index + 1}
                          </span>
                          <Input
                            value={question.label}
                            onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                            className="text-lg font-semibold"
                            placeholder="Question text..."
                          />
                        </div>
                        <div className="flex items-center gap-4 ml-11">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Points:</Label>
                            <Input
                              type="number"
                              value={question.points || 10}
                              onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                              className="w-20"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Answer Choices */}
                    {question.choices?.map((choice) => (
                      <div key={choice.id} className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuestion(question.id, { correctAnswer: choice.value })}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center`}
                          style={{
                            borderColor: question.correctAnswer === choice.value ? '#3d5948' : '#e8e4db',
                            backgroundColor: question.correctAnswer === choice.value ? '#3d5948' : 'white'
                          }}
                        >
                          {question.correctAnswer === choice.value && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </button>
                        <Input
                          value={choice.label}
                          onChange={(e) => {
                            const newChoices = question.choices?.map(c =>
                              c.id === choice.id ? { ...c, label: e.target.value } : c
                            )
                            updateQuestion(question.id, { choices: newChoices })
                          }}
                          placeholder="Answer choice..."
                        />
                        {question.correctAnswer === choice.value && (
                          <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#3d5948', color: 'white' }}>
                            Correct
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Explanation */}
                    <div className="pt-3 border-t" style={{ borderColor: '#e8e4db' }}>
                      <Label className="text-sm mb-2 block">Explanation (shown after answering):</Label>
                      <Input
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                        placeholder="Explain why this is the correct answer..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Quiz Settings */}
          <div className="space-y-4">
            <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
              <CardHeader>
                <CardTitle style={{ color: '#142c1c' }}>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Passing Score */}
                <div className="space-y-2">
                  <Label>Passing Score (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.passingScore}
                    onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) })}
                  />
                  <p className="text-xs" style={{ color: '#3d5948' }}>
                    Minimum score required to pass
                  </p>
                </div>

                {/* Time Limit */}
                <div className="space-y-2">
                  <Label>Time Limit (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: '#3d5948' }} />
                    <Input
                      type="number"
                      min="0"
                      value={settings.timeLimit ? settings.timeLimit / 60 : 0}
                      onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) * 60 })}
                      placeholder="0 = no limit"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-3 border-t" style={{ borderColor: '#e8e4db' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Score</Label>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Display score to user</p>
                    </div>
                    <Switch
                      checked={settings.showScore}
                      onCheckedChange={(checked) => setSettings({ ...settings, showScore: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Correct Answers</Label>
                      <p className="text-xs" style={{ color: '#3d5948' }}>After submission</p>
                    </div>
                    <Switch
                      checked={settings.showCorrectAnswers}
                      onCheckedChange={(checked) => setSettings({ ...settings, showCorrectAnswers: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Retake</Label>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Users can retry</p>
                    </div>
                    <Switch
                      checked={settings.allowRetake}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowRetake: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Randomize Questions</Label>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Different order</p>
                    </div>
                    <Switch
                      checked={settings.randomizeQuestions}
                      onCheckedChange={(checked) => setSettings({ ...settings, randomizeQuestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Randomize Choices</Label>
                      <p className="text-xs" style={{ color: '#3d5948' }}>Shuffle answers</p>
                    </div>
                    <Switch
                      checked={settings.randomizeChoices}
                      onCheckedChange={(checked) => setSettings({ ...settings, randomizeChoices: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Summary */}
            <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                  <Award className="w-5 h-5" />
                  Score Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: '#3d5948' }}>Total Questions:</span>
                  <span className="font-bold" style={{ color: '#142c1c' }}>{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#3d5948' }}>Total Points:</span>
                  <span className="font-bold" style={{ color: '#142c1c' }}>{totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#3d5948' }}>Points to Pass:</span>
                  <span className="font-bold" style={{ color: '#142c1c' }}>
                    {Math.ceil((totalPoints * settings.passingScore) / 100)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
