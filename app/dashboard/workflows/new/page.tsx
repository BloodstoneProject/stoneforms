'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus,
  Zap,
  Mail,
  Tag,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowRight,
  Save,
  Play
} from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'condition' | 'action'
  config: any
}

export default function NewWorkflowPage() {
  const [workflowName, setWorkflowName] = useState('Untitled Workflow')
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'trigger',
      config: { type: 'form_submitted', formId: null }
    }
  ])
  const [isAddingNode, setIsAddingNode] = useState(false)

  const triggers = [
    { id: 'form_submitted', label: 'Form Submitted', icon: CheckCircle2, color: '#3d5948' },
    { id: 'quiz_passed', label: 'Quiz Passed', icon: CheckCircle2, color: '#3d5948' },
    { id: 'quiz_failed', label: 'Quiz Failed', icon: X, color: '#770a19' },
    { id: 'score_threshold', label: 'Score Threshold', icon: TrendingUp, color: '#142c1c' },
  ]

  const actions = [
    { id: 'send_email', label: 'Send Email', icon: Mail, color: '#3d5948' },
    { id: 'create_deal', label: 'Create Deal', icon: DollarSign, color: '#770a19' },
    { id: 'add_tag', label: 'Add Tag', icon: Tag, color: '#142c1c' },
    { id: 'update_contact', label: 'Update Contact', icon: Users, color: '#3d5948' },
    { id: 'wait', label: 'Wait / Delay', icon: Clock, color: '#3d5948' },
  ]

  const addAction = (actionType: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: 'action',
      config: { type: actionType }
    }
    setNodes([...nodes, newNode])
    setIsAddingNode(false)
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#f4f2ed' }}>
      {/* Top Bar */}
      <div className="h-16 border-b bg-white flex items-center justify-between px-6" style={{ borderColor: '#e8e4db' }}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/automations">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </Button>
          </Link>
          <div className="border-l h-6" style={{ borderColor: '#e8e4db' }}></div>
          <div>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
              style={{ color: '#142c1c' }}
            />
            <p className="text-xs" style={{ color: '#3d5948' }}>
              {nodes.filter(n => n.type === 'action').length} action{nodes.filter(n => n.type === 'action').length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button size="sm" className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
            <Play className="w-4 h-4" />
            Activate Workflow
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Info Card */}
          <Card className="mb-8" style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 mt-1" style={{ color: '#770a19' }} />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#142c1c' }}>
                    Build Your Workflow
                  </h3>
                  <p className="text-sm" style={{ color: '#3d5948' }}>
                    Create automated actions that trigger when specific events occur. 
                    Drag and connect different steps to build your perfect automation flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Canvas */}
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <div key={node.id}>
                {/* Node Card */}
                <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
                  <CardContent className="p-6">
                    {node.type === 'trigger' ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#3d5948' }}
                          >
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold" style={{ color: '#142c1c' }}>Trigger</h3>
                            <p className="text-sm" style={{ color: '#3d5948' }}>When this happens...</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                              Select Trigger
                            </label>
                            <select 
                              className="w-full rounded-md border p-3"
                              style={{ borderColor: '#e8e4db' }}
                              value={node.config.type}
                              onChange={(e) => {
                                const updated = [...nodes]
                                updated[index].config.type = e.target.value
                                setNodes(updated)
                              }}
                            >
                              {triggers.map(trigger => (
                                <option key={trigger.id} value={trigger.id}>
                                  {trigger.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {node.config.type === 'form_submitted' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                Which Form?
                              </label>
                              <select 
                                className="w-full rounded-md border p-3"
                                style={{ borderColor: '#e8e4db' }}
                              >
                                <option>Customer Feedback Survey</option>
                                <option>Lead Capture Form</option>
                                <option>Event Registration</option>
                              </select>
                            </div>
                          )}

                          {node.config.type === 'score_threshold' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Minimum Score (%)
                                </label>
                                <Input type="number" placeholder="80" />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Maximum Score (%)
                                </label>
                                <Input type="number" placeholder="100" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {(() => {
                            const ActionIcon = actions.find(a => a.id === node.config.type)?.icon || Mail
                            const actionColor = actions.find(a => a.id === node.config.type)?.color || '#3d5948'
                            return (
                              <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: actionColor }}
                              >
                                <ActionIcon className="w-5 h-5 text-white" />
                              </div>
                            )
                          })()}
                          <div className="flex-1">
                            <h3 className="font-semibold" style={{ color: '#142c1c' }}>
                              {actions.find(a => a.id === node.config.type)?.label || 'Action'}
                            </h3>
                            <p className="text-sm" style={{ color: '#3d5948' }}>Configure this action</p>
                          </div>
                          <button
                            onClick={() => setNodes(nodes.filter(n => n.id !== node.id))}
                            className="p-2 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>

                        {/* Action Config */}
                        <div className="space-y-3">
                          {node.config.type === 'send_email' && (
                            <>
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Email Template
                                </label>
                                <select className="w-full rounded-md border p-3" style={{ borderColor: '#e8e4db' }}>
                                  <option>Welcome Email</option>
                                  <option>Congratulations Template</option>
                                  <option>Follow-up Email</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Delay (minutes)
                                </label>
                                <Input type="number" placeholder="0" defaultValue="0" />
                              </div>
                            </>
                          )}

                          {node.config.type === 'create_deal' && (
                            <>
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Deal Value
                                </label>
                                <Input type="number" placeholder="5000" />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                  Pipeline Stage
                                </label>
                                <select className="w-full rounded-md border p-3" style={{ borderColor: '#e8e4db' }}>
                                  <option>Lead</option>
                                  <option>Qualified</option>
                                  <option>Proposal</option>
                                </select>
                              </div>
                            </>
                          )}

                          {node.config.type === 'add_tag' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                Tag Name
                              </label>
                              <Input placeholder="Hot Lead" />
                            </div>
                          )}

                          {node.config.type === 'wait' && (
                            <div>
                              <label className="text-sm font-medium mb-2 block" style={{ color: '#142c1c' }}>
                                Wait Duration (hours)
                              </label>
                              <Input type="number" placeholder="24" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Connector */}
                {index < nodes.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-8 rounded" style={{ backgroundColor: '#e8e4db' }}></div>
                  </div>
                )}

                {/* Add Action Button */}
                {index === nodes.length - 1 && !isAddingNode && (
                  <div className="flex justify-center py-4">
                    <Button
                      onClick={() => setIsAddingNode(true)}
                      variant="outline"
                      className="gap-2"
                      style={{ borderStyle: 'dashed' }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Action
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Action Selector */}
            {isAddingNode && (
              <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#142c1c' }}>Choose an Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {actions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => addAction(action.id)}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors text-left"
                        style={{ borderColor: '#e8e4db' }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: action.color }}
                        >
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium" style={{ color: '#142c1c' }}>
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddingNode(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
