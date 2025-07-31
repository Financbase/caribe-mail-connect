# QA System Setup Guide

## 🚀 **Quick Start**

### **1. Start Development Server**

```bash
cd caribe-mail-connect
npm run dev
```

**Access**: <http://localhost:5173/#/qa>

### **2. Database Setup (Required)**

#### **Option A: Supabase Dashboard (Recommended)**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your `prmcms` project
3. Navigate to **SQL Editor**
4. Copy the entire content from `QA_DATABASE_SETUP.sql`
5. Paste and run the script

#### **Option B: Supabase CLI**

```bash
# Link your project (if not already linked)
npx supabase link --project-ref flbwqsocnlvsuqgupbra

# Apply migrations
npx supabase db push
```

### **3. Environment Variables**

Ensure these are set in your `.env.local`:

```env
VITE_SUPABASE_URL=https://flbwqsocnlvsuqgupbra.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🧪 **Testing Checklist**

### **✅ Basic Functionality**

- [ ] **QA Dashboard Access**: Navigate to `/qa` route
- [ ] **Sidebar Navigation**: "Quality Assurance" appears
- [ ] **Tab Navigation**: All 12 tabs work
- [ ] **Charts Render**: Trend charts and process flows display
- [ ] **Mobile Responsive**: Test on mobile viewport
- [ ] **Language Toggle**: Spanish/English switching works

### **✅ Database Integration**

- [ ] **Tables Created**: All QA tables exist in Supabase
- [ ] **Sample Data**: Test data displays in components
- [ ] **Real-time Updates**: Changes reflect immediately
- [ ] **Error Handling**: Graceful handling of connection issues

### **✅ Advanced Features**

- [ ] **Notifications**: Compliance deadline alerts
- [ ] **Reporting**: Automated report generation
- [ ] **Mobile Audit**: Offline-capable audit interface
- [ ] **Process Flows**: Mermaid diagrams render correctly

## 🔧 **Configuration Steps**

### **Step 1: Notification Settings**

1. Navigate to QA Dashboard
2. Go to Compliance Monitoring tab
3. Configure notification preferences:
   - Email notifications: ON
   - Push notifications: ON
   - Deadline reminders: 7 days
   - Certification reminders: 30 days

### **Step 2: Report Scheduling**

1. Go to Reports section
2. Create automated reports:
   - **Weekly Compliance Report** (PDF)
   - **Monthly Quality Metrics** (Excel)
   - **Quarterly Audit Summary** (PDF)

### **Step 3: User Permissions**

1. Set up role-based access:
   - **QA Managers**: Full access to all features
   - **Auditors**: Access to audit tools and reports
   - **Staff**: View-only access to dashboards

## 📱 **Mobile Setup**

### **PWA Installation**

1. Open app on mobile device
2. Add to home screen
3. Test offline functionality
4. Verify camera integration

### **Mobile Audit Interface**

1. Access mobile audit component
2. Test photo capture
3. Verify location tracking
4. Test offline data sync

## 🎯 **Training Materials**

### **For QA Managers**

- **Dashboard Overview**: Understanding metrics and KPIs
- **Compliance Monitoring**: Managing regulatory requirements
- **Report Generation**: Creating and scheduling reports
- **Team Management**: Assigning tasks and tracking progress

### **For Auditors**

- **Mobile Audit Interface**: Using the field audit tool
- **Photo Documentation**: Capturing evidence
- **Offline Mode**: Working without internet
- **Data Sync**: Uploading audit results

### **For Staff**

- **Quality Checks**: Performing routine quality checks
- **Suggestion System**: Submitting improvement ideas
- **Mystery Shopper**: Participating in evaluations
- **Compliance Awareness**: Understanding requirements

## 🔍 **Troubleshooting**

### **Common Issues**

#### **Charts Not Rendering**

```bash
# Install chart dependencies
npm install recharts mermaid --legacy-peer-deps
```

#### **Database Connection Errors**

- Check environment variables
- Verify Supabase project URL
- Ensure tables are created

#### **Mobile Issues**

- Clear browser cache
- Check PWA installation
- Verify camera permissions

#### **Performance Issues**

- Check network connectivity
- Monitor memory usage
- Optimize image sizes

### **Debug Commands**

```bash
# Check dependencies
npm list recharts mermaid

# Verify build
npm run build

# Check for errors
npm run lint

# Test production build
npm run preview
```

## 📊 **Performance Benchmarks**

### **Target Metrics**

- **Page Load**: < 3 seconds
- **Chart Render**: < 1 second
- **Data Fetch**: < 200ms
- **Mobile Performance**: < 5 seconds on 3G
- **Offline Sync**: < 30 seconds

### **Monitoring**

- Use browser DevTools
- Check Network tab
- Monitor Console for errors
- Test on multiple devices

## 🚀 **Production Deployment**

### **Pre-deployment Checklist**

- [ ] All tests pass
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Team training completed

### **Deployment Steps**

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**
   - Vercel, Netlify, or your preferred platform

3. **Configure environment variables**
   - Set production Supabase credentials

4. **Test production deployment**
   - Verify all features work
   - Check mobile responsiveness
   - Test offline capabilities

## 📞 **Support & Maintenance**

### **Regular Maintenance**

- **Weekly**: Review QA metrics and reports
- **Monthly**: Update compliance requirements
- **Quarterly**: Performance optimization
- **Annually**: Security audit and updates

### **Support Contacts**

- **Technical Issues**: Development team
- **QA Process**: QA Manager
- **Compliance**: Legal/Compliance team
- **Training**: HR/Training team

---

## 🎉 **Success Criteria**

The QA system is successfully deployed when:

1. ✅ **All 12 QA tabs function correctly**
2. ✅ **Database tables are created and populated**
3. ✅ **Charts and visualizations render properly**
4. ✅ **Mobile interface works offline**
5. ✅ **Notifications system is configured**
6. ✅ **Reporting automation is set up**
7. ✅ **Team training is completed**
8. ✅ **Performance benchmarks are met**

**Status**: 🟡 In Progress
**Next Milestone**: Database Setup Complete
