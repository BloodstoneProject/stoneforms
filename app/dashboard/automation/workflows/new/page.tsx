'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, WorkflowTrigger, WorkflowAction } from '@/types'
import { 
  Plus,
  Zap,
  Mail,
  DollarSign,
  Tag,
  Webhook,
  MessageSquare,
  FileText,
  Clock,
  ChevronRight,
  Trash2,
  Save
} from 'lucide-react'

const TRIGGER_TYPES = [
  { type: 'form_submitted', label: 'Form Submitted', icon: FileText, color: '#142c1c' },
  { type: 'score_achieved', label: 'Quiz Score Achieved', icon: Zap, color: '#3d5948' },
  { type: 'answer_given', label: 'Specific Answer Given', icon: MessageSquare, color: '#770a19' },
]

const ACTION_TYPES = [
  { type: 'send_email', label: 'Send Email', icon: Mail, color: '#142c1c' },
  { type: 'create_deal', label: 'Create Deal', icon: DollarSign, color: '#3d5948' },
  { type: 'add_tag', label: 'Add Tag to Contact', icon: Tag, color: '#770a19' },
  { type: 'webhook', label: 'Trigger Webhook', icon: Webhook, color: '#142c1c' },
  { type: 'slack_notify', label: 'Send Slack Message', icon: MessageSquare, color: '#3d5948' },
]

export default function WorkflowBuilderPage() {
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [trigger, setTrigger] = useState<WorkflowTrigger | null>(null)
  const [actions, setActions] = useState<WorkflowAction[]>([])
  const [enabled, setEnabled] = useState(true)

  const addAction = (type: string) => {
    const newAction: WorkflowAction = {
      id: `action_${Date.now()}`,
      type: type as any,
      config: {},
      delay: 0,
    }
    setActions([...actions, newAction])
  }

  const updateAction = (id: string, updates: Partial<WorkflowAction>) => {
    setActions(actions.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id))
  }

  const saveWorkflow = () => {
    if (!trigger) {
      alert('Please select a trigger')
      return
    }
    if (actions.length === 0) {
      alert('Please add at least one action')
      return
    }

    const workflow: Workflow = {
      id: `wf_${Date.now()}`,
      workspaceId: 'ws_1',
      name: workflowName,
      trigger,
      actions,
      enabled,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log('Saving workflow:', workflow)
    alert('Workflow saved successfully!')
  }

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#f4f2ed', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 mb-2"
            style={{ color: '#142c1c' }}
          />
          <p style={{ color: '#3d5948' }}>
            Automate actions based on form responses
          </p>
        </div>
        <Button onClick={saveWorkflow} className="gap-2 text-white" style={{ backgroundColor: '#142c1c' }}>
          <Save className="w-4 h-4" />
          Save Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Trigger Selection */}
        <div className="space-y-4">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                <Zap className="w-5 h-5" />
                Trigger
              </CardTitle>
              <p className="text-sm" style={{ color: '#3d5948' }}>
                When should this workflow run?
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {TRIGGER_TYPES.map((triggerType) => (
                <button
                  key={triggerType.type}
                  onClick={() => setTrigger({ type: triggerType.type as any })}
                  className={`w-full p-4 border-2 rounded-lg text-left hover:shadow-md transition flex items-center gap-3`}
                  style={{
                    borderColor: trigger?.type === triggerType.type ? triggerType.color : '#e8e4db',
                    backgroundColor: trigger?.type === triggerType.type ? `${triggerType.color}10` : 'white'
                  }}
                >
                  <triggerType.icon className="w-6 h-6" style={{ color: triggerType.color }} />
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#142c1c' }}>
                      {triggerType.label}
                    </div>
                  </div>
                  {trigger?.type === triggerType.type && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: triggerType.color }}>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Trigger Configuration */}
          {trigger && (
            <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: '#142c1c' }}>
                  Trigger Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Form</Label>
                  <select className="w-full rounded-lg border p-2" style={{ borderColor: '#e8e4db' }}>
                    <option>Customer Feedback Survey</option>
                    <option>Lead Capture Form</option>
                    <option>Event Registration</option>
                  </select>
                </div>

                {trigger.type === 'score_achieved' && (
                  <div className="space-y-2">
                    <Label>Minimum Score (%)</Label>
                    <Input type="number" min="0" max="100" defaultValue="80" />
                  </div>
                )}

                {trigger.type === 'answer_given' && (
                  <>
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <select className="w-full rounded-lg border p-2" style={{ borderColor: '#e8e4db' }}>
                        <option>How did you hear about us?</option>
                        <option>What is your budget?</option>
                        <option>When do you need this?</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Answer Equals</Label>
                      <Input placeholder="e.g., Social Media" />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center - Workflow Visualization */}
        <div className="space-y-4">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle style={{ color: '#142c1c' }}>Workflow Flow</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Trigger Node */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-lg border-2 flex items-center gap-3"
                  style={{ 
                    borderColor: trigger ? '#142c1c' : '#e8e4db',
                    backgroundColor: trigger ? '#142c1c10' : '#f4f2ed'
                  }}
                >
                  <Zap className="w-6 h-6" style={{ color: '#142c1c' }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium" style={{ color: '#3d5948' }}>
                      WHEN
                    </div>
                    <div className="font-semibold" style={{ color: '#142c1c' }}>
                      {trigger ? TRIGGER_TYPES.find(t => t.type === trigger.type)?.label : 'Select a trigger'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector */}
              {actions.length > 0 && (
                <div className="flex justify-center my-2">
                  <div className="w-0.5 h-8" style={{ backgroundColor: '#e8e4db' }}></div>
                </div>
              )}

              {/* Action Nodes */}
              {actions.map((action, index) => {
                const actionType = ACTION_TYPES.find(a => a.type === action.type)
                return (
                  <div key={action.id}>
                    {index > 0 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0.5 h-8" style={{ backgroundColor: '#e8e4db' }}></div>
                      </div>
                    )}
                    <div 
                      className="p-4 rounded-lg border-2 flex items-center gap-3 group"
                      style={{ borderColor: actionType?.color || '#e8e4db', backgroundColor: 'white' }}
                    >
                      {actionType && <actionType.icon className="w-6 h-6" style={{ color: actionType.color }} />}
                      <div className="flex-1">
                        <div className="text-xs font-medium" style={{ color: '#3d5948' }}>
                          THEN {action.delay ? `(after ${action.delay}s)` : ''}
                        </div>
                        <div className="font-semibold" style={{ color: '#142c1c' }}>
                          {actionType?.label}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteAction(action.id)}
                        className="opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Add Action Hint */}
              {actions.length === 0 && (
                <div className="text-center py-8" style={{ color: '#3d5948' }}>
                  <p className="text-sm">Add actions from the right →</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right - Actions */}
        <div className="space-y-4">
          <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#142c1c' }}>
                <Zap className="w-5 h-5" />
                Actions
              </CardTitle>
              <p className="text-sm" style={{ color: '#3d5948' }}>
                What should happen?
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {ACTION_TYPES.map((actionType) => (
                <button
                  key={actionType.type}
                  onClick={() => addAction(actionType.type)}
                  className="w-full p-4 border-2 rounded-lg text-left hover:shadow-md transition flex items-center gap-3"
                  style={{ borderColor: '#e8e4db' }}
                  disabled={!trigger}
                >
                  <actionType.icon className="w-6 h-6" style={{ color: actionType.color }} />
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#142c1c' }}>
                      {actionType.label}
                    </div>
                  </div>
                  <Plus className="w-4 h-4" style={{ color: '#3d5948' }} />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Selected Action Configuration */}
          {actions.length > 0 && (
            <Card style={{ backgroundColor: 'white', borderColor: '#e8e4db' }}>
              <CardHeader>
                <CardTitle className="text-sm" style={{ color: '#142c1c' }}>
                  Configure Latest Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {actions[actions.length - 1].type === 'send_email' && (
                  <>
                    <div className="space-y-2">
                      <Label>Email Template</Label>
                      <select className="w-full rounded-lg border p-2" style={{ borderColor: '#e8e4db' }}>
                        <option>Thank You Email</option>
                        <option>Welcome Email</option>
                        <option>Follow-up Email</option>
                      </select>
                    </div>
                  </>
                )}

                {actions[actions.length - 1].type === 'create_deal' && (
                  <>
                    <div className="space-y-2">
                      <Label>Deal Title</Label>
                      <Input placeholder="e.g., New Lead - {{company}}" />
                    </div>
                    <div className="space-y-2">
                      <Label>Deal Value ($)</Label>
                      <Input type="number" placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Pipeline Stage</Label>
                      <select className="w-full rounded-lg border p-2" style={{ borderColor: '#e8e4db' }}>
                        <option>Lead</option>
                        <option>Qualified</option>
                        <option>Proposal</option>
                      </select>
                    </div>
                  </>
                )}

                {actions[actions.length - 1].type === 'add_tag' && (
                  <div className="space-y-2">
                    <Label>Tag Name</Label>
                    <Input placeholder="e.g., Hot Lead" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Delay (seconds)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="0 = immediate"
                    onChange={(e) => updateAction(actions[actions.length - 1].id, { delay: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
