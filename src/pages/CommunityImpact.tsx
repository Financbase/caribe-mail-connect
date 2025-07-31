import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  GraduationCap, 
  Handshake, 
  UserCheck, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  Leaf,
  MapPin,
  Star,
  TreePine
} from 'lucide-react';
import {
  mockLocalInitiatives,
  mockEnvironmentalEducation,
  mockPartnerPrograms,
  mockCustomerParticipation,
  mockImpactReport
} from '@/data/sustainabilityData';
import { 
  LocalInitiative, 
  EnvironmentalEducation, 
  PartnerProgram, 
  CustomerParticipation, 
  ImpactReport 
} from '@/types/sustainability';

export default function CommunityImpact() {
  const [selectedInitiative, setSelectedInitiative] = useState<LocalInitiative | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<EnvironmentalEducation | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerProgram | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTrendIcon = (value: number, previousValue: number) => {
    if (value > previousValue) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < previousValue) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  // Calculate totals
  const totalParticipants = mockLocalInitiatives.reduce((sum, init) => sum + init.participants, 0);
  const totalPeopleReached = mockLocalInitiatives.reduce((sum, init) => sum + init.impact.peopleReached, 0);
  const totalCarbonSaved = mockLocalInitiatives.reduce((sum, init) => sum + init.impact.carbonSaved, 0);
  const totalWasteCollected = mockLocalInitiatives.reduce((sum, init) => sum + init.impact.wasteCollected, 0);
  const totalTreesPlanted = mockLocalInitiatives.reduce((sum, init) => sum + init.impact.treesPlanted, 0);
  const totalEducationParticipants = mockEnvironmentalEducation.reduce((sum, edu) => sum + edu.participants, 0);
  const activePartners = mockPartnerPrograms.filter(partner => partner.status === 'active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Community Impact
          </h1>
          <p className="text-gray-600 mt-2">
            Environmental initiatives and community engagement programs
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalParticipants)}</div>
            <p className="text-xs text-muted-foreground">
              Total community participants
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalParticipants, 200)}
              <span className="text-xs text-green-600 ml-1">+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Reached</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalPeopleReached)}</div>
            <p className="text-xs text-muted-foreground">
              Total people reached
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalPeopleReached, 700)}
              <span className="text-xs text-green-600 ml-1">+14.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCarbonSaved)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO2 saved through initiatives
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalCarbonSaved, 3000)}
              <span className="text-xs text-green-600 ml-1">+16.7% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trees Planted</CardTitle>
            <TreePine className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalTreesPlanted)}</div>
            <p className="text-xs text-muted-foreground">
              Trees planted in community
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon(totalTreesPlanted, 180)}
              <span className="text-xs text-green-600 ml-1">+11.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="initiatives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="initiatives">Local Initiatives</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="partners">Partner Programs</TabsTrigger>
          <TabsTrigger value="participation">Customer Participation</TabsTrigger>
          <TabsTrigger value="reporting">Impact Reporting</TabsTrigger>
        </TabsList>

        {/* Local Initiatives Tab */}
        <TabsContent value="initiatives" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Local Initiatives
                </CardTitle>
                <CardDescription>
                  Community-based environmental projects and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLocalInitiatives.map((initiative) => (
                    <div
                      key={initiative.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedInitiative(initiative)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{initiative.name}</h3>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{initiative.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Category</div>
                          <div className="font-semibold capitalize">{initiative.category}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-semibold">{initiative.location}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{initiative.participants}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Budget</div>
                          <div className="font-semibold">${formatNumber(initiative.budget)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">People Reached</div>
                          <div className="font-semibold">{formatNumber(initiative.impact.peopleReached)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{formatNumber(initiative.impact.carbonSaved)} kg</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Initiative Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {mockLocalInitiatives.length}
                    </div>
                    <div className="text-sm text-blue-700">Total Initiatives</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Status Distribution:</h3>
                    {['active', 'completed', 'planned'].map((status) => {
                      const count = mockLocalInitiatives.filter(init => init.status === status).length;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status}</span>
                            <span>{count} initiatives</span>
                          </div>
                          <Progress 
                            value={(count / mockLocalInitiatives.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(totalWasteCollected)}
                    </div>
                    <div className="text-sm text-green-700">Total Waste Collected (kg)</div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Initiatives by Category:</h3>
                    {['education', 'cleanup', 'conservation', 'awareness'].map((category) => {
                      const count = mockLocalInitiatives.filter(init => init.category === category).length;
                      return (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span>{count} initiatives</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Environmental Education
                </CardTitle>
                <CardDescription>
                  Educational programs and workshops on environmental topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEnvironmentalEducation.map((education) => (
                    <div
                      key={education.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEducation(education)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{education.title}</h3>
                        <Badge variant="outline" className="capitalize">{education.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Audience</div>
                          <div className="font-semibold capitalize">{education.audience}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{education.participants}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Date</div>
                          <div className="font-semibold">{new Date(education.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Rating</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{education.feedback.rating}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {education.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Education Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {formatNumber(totalEducationParticipants)}
                    </div>
                    <div className="text-sm text-green-700">Total Participants</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Education by Type:</h3>
                    {['workshop', 'presentation', 'training', 'campaign'].map((type) => {
                      const count = mockEnvironmentalEducation.filter(edu => edu.type === type).length;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type}</span>
                            <span>{count} programs</span>
                          </div>
                          <Progress 
                            value={(count / mockEnvironmentalEducation.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(mockEnvironmentalEducation.reduce((sum, edu) => sum + edu.feedback.rating, 0) / mockEnvironmentalEducation.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-blue-700">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Partner Programs Tab */}
        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5" />
                  Partner Programs
                </CardTitle>
                <CardDescription>
                  Collaborative environmental programs with partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPartnerPrograms.map((partner) => (
                    <div
                      key={partner.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedPartner(partner)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{partner.partnerName}</h3>
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{partner.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Program Type</div>
                          <div className="font-semibold capitalize">{partner.programType.replace('-', ' ')}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="font-semibold">{new Date(partner.startDate).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Carbon Saved</div>
                          <div className="font-semibold text-green-600">{formatNumber(partner.impact.carbonSaved)} kg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cost Savings</div>
                          <div className="font-semibold text-green-600">${formatNumber(partner.impact.costSavings)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{partner.impact.participants}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Partner Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {activePartners}
                    </div>
                    <div className="text-sm text-blue-700">Active Partners</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Programs by Type:</h3>
                    {['recycling', 'energy', 'transportation', 'education'].map((type) => {
                      const count = mockPartnerPrograms.filter(partner => partner.programType === type).length;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type}</span>
                            <span>{count} programs</span>
                          </div>
                          <Progress 
                            value={(count / mockPartnerPrograms.length) * 100} 
                            className="h-2" 
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(mockPartnerPrograms.reduce((sum, partner) => sum + partner.impact.carbonSaved, 0))}
                    </div>
                    <div className="text-sm text-green-700">Total Carbon Saved (kg CO2)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Participation Tab */}
        <TabsContent value="participation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Customer Participation
              </CardTitle>
              <CardDescription>
                Track customer engagement in environmental programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomerParticipation.map((participation) => (
                  <div key={participation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">Customer {participation.customerId}</h3>
                      <Badge className={getStatusColor(participation.status)}>
                        {participation.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Program</div>
                        <div className="font-semibold">{participation.program}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Participation Date</div>
                        <div className="font-semibold">{new Date(participation.participationDate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Total Impact</div>
                        <div className="font-semibold text-green-600">{participation.totalImpact} kg CO2</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Actions</div>
                        <div className="font-semibold">{participation.actions.length}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Recent Actions:</div>
                      <div className="space-y-1">
                        {participation.actions.slice(0, 3).map((action, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {action.action} ({action.impact} kg CO2) - {new Date(action.date).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Rewards:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {participation.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Reporting Tab */}
        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Impact Report - {mockImpactReport.period}
              </CardTitle>
              <CardDescription>
                Comprehensive community impact assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Impact Summary</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(mockImpactReport.summary.totalCarbonSaved)}
                        </div>
                        <div className="text-sm text-green-700">Carbon Saved (kg CO2)</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(mockImpactReport.summary.totalWasteReduced)}
                        </div>
                        <div className="text-sm text-blue-700">Waste Reduced (kg)</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {formatNumber(mockImpactReport.summary.totalEnergySaved)}
                        </div>
                        <div className="text-sm text-yellow-700">Energy Saved (kWh)</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatNumber(mockImpactReport.summary.treesPlanted)}
                        </div>
                        <div className="text-sm text-purple-700">Trees Planted</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Report Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Period</div>
                      <div className="font-semibold">{mockImpactReport.period}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold">{new Date(mockImpactReport.date).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Cost Savings</div>
                      <div className="font-semibold text-green-600">${formatNumber(mockImpactReport.summary.totalCostSavings)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">People Reached</div>
                      <div className="font-semibold">{formatNumber(mockImpactReport.summary.peopleReached)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Highlights</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {mockImpactReport.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Challenges</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {mockImpactReport.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Next Period Goals</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {mockImpactReport.nextPeriodGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Initiative Details */}
      {selectedInitiative && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedInitiative.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedInitiative(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Initiative Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-semibold capitalize">{selectedInitiative.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold">{selectedInitiative.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedInitiative.status)}>
                      {selectedInitiative.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-semibold">{new Date(selectedInitiative.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-semibold">${formatNumber(selectedInitiative.budget)}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedInitiative.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Impact Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-semibold">{selectedInitiative.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>People Reached:</span>
                    <span className="font-semibold">{formatNumber(selectedInitiative.impact.peopleReached)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedInitiative.impact.carbonSaved)} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waste Collected:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedInitiative.impact.wasteCollected)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trees Planted:</span>
                    <span className="font-semibold text-green-600">{selectedInitiative.impact.treesPlanted}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Education Details */}
      {selectedEducation && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedEducation.title}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedEducation(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Program Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-semibold capitalize">{selectedEducation.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audience:</span>
                    <span className="font-semibold capitalize">{selectedEducation.audience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-semibold">{selectedEducation.participants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold">{new Date(selectedEducation.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{selectedEducation.feedback.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Topics & Impact</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Topics Covered:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedEducation.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Knowledge Increase:</span>
                      <span className="font-semibold">{selectedEducation.impact.knowledgeIncrease}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Behavior Change:</span>
                      <span className="font-semibold">{selectedEducation.impact.behaviorChange}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Carbon Saved:</span>
                      <span className="font-semibold text-green-600">{selectedEducation.impact.carbonSaved} kg CO2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Partner Details */}
      {selectedPartner && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedPartner.partnerName}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedPartner(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Partner Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Program Type:</span>
                    <span className="font-semibold capitalize">{selectedPartner.programType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className={getStatusColor(selectedPartner.status)}>
                      {selectedPartner.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-semibold">{new Date(selectedPartner.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedPartner.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Impact & Commitments</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Carbon Saved:</span>
                    <span className="font-semibold text-green-600">{formatNumber(selectedPartner.impact.carbonSaved)} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Savings:</span>
                    <span className="font-semibold text-green-600">${formatNumber(selectedPartner.impact.costSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-semibold">{selectedPartner.impact.participants}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Commitments</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {selectedPartner.commitments.map((commitment, index) => (
                      <li key={index}>{commitment}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Achievements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {selectedPartner.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 