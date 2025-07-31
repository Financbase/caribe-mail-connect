import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  Handshake, 
  UserCheck, 
  FileText, 
  MapPin,
  Calendar,
  DollarSign,
  Leaf,
  Target,
  TrendingUp
} from 'lucide-react';
import {
  LocalInitiative,
  EnvironmentalEducation,
  PartnerProgram,
  CustomerParticipation,
  ImpactReport
} from '@/types/sustainability';

interface CommunityImpactTrackerProps {
  localInitiatives: LocalInitiative[];
  environmentalEducation: EnvironmentalEducation[];
  partnerPrograms: PartnerProgram[];
  customerParticipation: CustomerParticipation[];
  impactReport: ImpactReport;
}

export default function CommunityImpactTracker({
  localInitiatives,
  environmentalEducation,
  partnerPrograms,
  customerParticipation,
  impactReport
}: CommunityImpactTrackerProps) {
  const [selectedInitiative, setSelectedInitiative] = useState<LocalInitiative | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<EnvironmentalEducation | null>(null);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'cleanup': return 'bg-green-100 text-green-800';
      case 'conservation': return 'bg-yellow-100 text-yellow-800';
      case 'awareness': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPeopleReached = 
    localInitiatives.reduce((sum, initiative) => sum + initiative.impact.peopleReached, 0) +
    environmentalEducation.reduce((sum, education) => sum + education.participants, 0);

  const totalCarbonSaved = 
    localInitiatives.reduce((sum, initiative) => sum + initiative.impact.carbonSaved, 0) +
    environmentalEducation.reduce((sum, education) => sum + education.impact.carbonSaved, 0) +
    partnerPrograms.reduce((sum, program) => sum + program.impact.carbonSaved, 0) +
    customerParticipation.reduce((sum, customer) => sum + customer.totalImpact, 0);

  const totalParticipants = 
    localInitiatives.reduce((sum, initiative) => sum + initiative.participants, 0) +
    environmentalEducation.reduce((sum, education) => sum + education.participants, 0) +
    partnerPrograms.reduce((sum, program) => sum + program.impact.participants, 0) +
    customerParticipation.length;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Users className="h-6 w-6" />
          Community Impact Tracker
        </CardTitle>
        <CardDescription>
          Monitor local initiatives, education programs, partnerships, and community engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalPeopleReached)}
            </div>
            <div className="text-sm text-green-700">People Reached</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(totalCarbonSaved)}
            </div>
            <div className="text-sm text-blue-700">kg CO2 Saved</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {formatNumber(totalParticipants)}
            </div>
            <div className="text-sm text-yellow-700">Total Participants</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {localInitiatives.length + partnerPrograms.length}
            </div>
            <div className="text-sm text-purple-700">Active Programs</div>
          </div>
        </div>

        <Tabs defaultValue="initiatives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="initiatives">Local Initiatives</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="reports">Impact Reports</TabsTrigger>
          </TabsList>

          {/* Local Initiatives Tab */}
          <TabsContent value="initiatives" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {localInitiatives.map((initiative) => (
                  <Card 
                    key={initiative.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedInitiative(initiative)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {initiative.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(initiative.category)}>
                          {initiative.category}
                        </Badge>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{initiative.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-semibold text-sm">{initiative.location}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{initiative.participants}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Budget</div>
                          <div className="font-semibold">${formatNumber(initiative.budget)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">People Reached</div>
                          <div className="font-semibold">{formatNumber(initiative.impact.peopleReached)}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-500">Carbon Saved</div>
                            <div className="font-semibold text-green-600">
                              {formatNumber(initiative.impact.carbonSaved)} kg
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Waste Collected</div>
                            <div className="font-semibold text-green-600">
                              {formatNumber(initiative.impact.wasteCollected)} kg
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Trees Planted</div>
                            <div className="font-semibold text-green-600">
                              {initiative.impact.treesPlanted}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {new Date(initiative.startDate).toLocaleDateString()} - 
                        {initiative.endDate ? new Date(initiative.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Initiatives Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {localInitiatives.filter(init => init.status === 'active').length}
                      </div>
                      <div className="text-sm text-green-700">Active Initiatives</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(localInitiatives.reduce((sum, init) => sum + init.impact.peopleReached, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total People Reached</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        ${formatNumber(localInitiatives.reduce((sum, init) => sum + init.budget, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">Total Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Environmental Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {environmentalEducation.map((education) => (
                  <Card 
                    key={education.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedEducation(education)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        {education.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {education.type}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {education.audience}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{education.participants}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Rating</div>
                          <div className="font-semibold">★ {education.feedback.rating}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Knowledge Increase</div>
                          <div className="font-semibold text-green-600">
                            {education.impact.knowledgeIncrease}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Behavior Change</div>
                          <div className="font-semibold text-green-600">
                            {education.impact.behaviorChange}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {education.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-sm text-gray-500">Carbon Saved</div>
                        <div className="font-semibold text-green-600">
                          {formatNumber(education.impact.carbonSaved)} kg CO2
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Date: {new Date(education.date).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Education Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {environmentalEducation.length}
                      </div>
                      <div className="text-sm text-green-700">Education Programs</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(environmentalEducation.reduce((sum, edu) => sum + edu.participants, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Participants</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {Math.round(environmentalEducation.reduce((sum, edu) => sum + edu.feedback.rating, 0) / environmentalEducation.length * 10) / 10}
                      </div>
                      <div className="text-sm text-yellow-700">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Partner Programs Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {partnerPrograms.map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Handshake className="h-5 w-5" />
                        {program.partnerName}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {program.programType}
                        </Badge>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{program.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Start Date</div>
                          <div className="font-semibold">
                            {new Date(program.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Participants</div>
                          <div className="font-semibold">{program.impact.participants}</div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-sm text-gray-500">Carbon Saved</div>
                            <div className="font-semibold text-green-600">
                              {formatNumber(program.impact.carbonSaved)} kg
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Cost Savings</div>
                            <div className="font-semibold text-green-600">
                              ${formatNumber(program.impact.costSavings)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Commitments:</div>
                        <div className="space-y-1">
                          {program.commitments.map((commitment, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{commitment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Achievements:</div>
                        <div className="space-y-1">
                          {program.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Partnership Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {partnerPrograms.filter(prog => prog.status === 'active').length}
                      </div>
                      <div className="text-sm text-green-700">Active Partnerships</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(partnerPrograms.reduce((sum, prog) => sum + prog.impact.carbonSaved, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total kg CO2 Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        ${formatNumber(partnerPrograms.reduce((sum, prog) => sum + prog.impact.costSavings, 0))}
                      </div>
                      <div className="text-sm text-yellow-700">Total Cost Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Participation Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {customerParticipation.map((customer) => (
                  <Card key={customer.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Customer {customer.customerId}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{customer.program}</Badge>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Participation Date</div>
                          <div className="font-semibold">
                            {new Date(customer.participationDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Impact</div>
                          <div className="font-semibold text-green-600">
                            {formatNumber(customer.totalImpact)} kg CO2
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Actions Taken:</div>
                        <div className="space-y-1">
                          {customer.actions.map((action, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">{action.action}</span>
                              <span className="text-sm font-medium text-green-600">
                                {action.impact} kg CO2
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Rewards Earned:</div>
                        <div className="flex flex-wrap gap-1">
                          {customer.rewards.map((reward, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {reward}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Participation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {customerParticipation.length}
                      </div>
                      <div className="text-sm text-green-700">Participating Customers</div>
                    </div>
                    
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatNumber(customerParticipation.reduce((sum, cust) => sum + cust.totalImpact, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total kg CO2 Saved</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {customerParticipation.filter(cust => cust.status === 'active').length}
                      </div>
                      <div className="text-sm text-yellow-700">Active Participants</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Impact Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {impactReport.period} Impact Report
                </CardTitle>
                <div className="text-sm text-gray-600">
                  Generated: {new Date(impactReport.date).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Impact Summary</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {formatNumber(impactReport.summary.totalCarbonSaved)}
                          </div>
                          <div className="text-sm text-green-700">kg CO2 Saved</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(impactReport.summary.totalWasteReduced)}
                          </div>
                          <div className="text-sm text-blue-700">kg Waste Reduced</div>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {formatNumber(impactReport.summary.totalEnergySaved)}
                          </div>
                          <div className="text-sm text-yellow-700">kWh Energy Saved</div>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            ${formatNumber(impactReport.summary.totalCostSavings)}
                          </div>
                          <div className="text-sm text-purple-700">Cost Savings</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-emerald-600">
                            {impactReport.summary.treesPlanted}
                          </div>
                          <div className="text-sm text-emerald-700">Trees Planted</div>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {formatNumber(impactReport.summary.peopleReached)}
                          </div>
                          <div className="text-sm text-indigo-700">People Reached</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Highlights</h3>
                      <div className="space-y-2">
                        {impactReport.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Challenges</h3>
                      <div className="space-y-2">
                        {impactReport.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3">Next Period Goals</h3>
                      <div className="space-y-2">
                        {impactReport.nextPeriodGoals.map((goal, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Stakeholders</h3>
                  <div className="flex flex-wrap gap-2">
                    {impactReport.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="outline">
                        {stakeholder}
                      </Badge>
                    ))}
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
                <span>{selectedInitiative.name} Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedInitiative(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Initiative Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="font-medium capitalize">{selectedInitiative.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{selectedInitiative.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{selectedInitiative.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">{selectedInitiative.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">${formatNumber(selectedInitiative.budget)}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 mt-4">Description</h3>
                  <p className="text-sm text-gray-600">{selectedInitiative.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Impact Metrics</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">People Reached</span>
                        <span className="font-semibold text-green-600">
                          {formatNumber(selectedInitiative.impact.peopleReached)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Carbon Saved</span>
                        <span className="font-semibold text-blue-600">
                          {formatNumber(selectedInitiative.impact.carbonSaved)} kg CO2
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Waste Collected</span>
                        <span className="font-semibold text-yellow-600">
                          {formatNumber(selectedInitiative.impact.wasteCollected)} kg
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Trees Planted</span>
                        <span className="font-semibold text-purple-600">
                          {selectedInitiative.impact.treesPlanted}
                        </span>
                      </div>
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
                <span>{selectedEducation.title} Details</span>
                <Button variant="outline" size="sm" onClick={() => setSelectedEducation(null)}>
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Program Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="font-medium capitalize">{selectedEducation.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audience:</span>
                      <span className="font-medium capitalize">{selectedEducation.audience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participants:</span>
                      <span className="font-medium">{selectedEducation.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {new Date(selectedEducation.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium">★ {selectedEducation.feedback.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 mt-4">Topics Covered</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedEducation.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Impact Assessment</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Knowledge Increase</span>
                        <span className="font-semibold text-green-600">
                          {selectedEducation.impact.knowledgeIncrease}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Behavior Change</span>
                        <span className="font-semibold text-blue-600">
                          {selectedEducation.impact.behaviorChange}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Carbon Saved</span>
                        <span className="font-semibold text-yellow-600">
                          {formatNumber(selectedEducation.impact.carbonSaved)} kg CO2
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 mt-4">Feedback</h3>
                  <div className="space-y-2">
                    {selectedEducation.feedback.comments.map((comment, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        "{comment}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
} 