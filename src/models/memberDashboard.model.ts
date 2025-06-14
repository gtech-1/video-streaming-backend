import mongoose, { Schema, Document } from 'mongoose';

// Interfaces
interface ICreditsDoughnutChart {
  earnedCredits: number;
  totalCredits: number;
  size: number;
}

interface IStatisticsChart {
  title: string;
  labels: string[];
  values: number[];
}

interface IAttendanceBarGraph {
  labels: string[];
  values: number[];
}

interface ITopStudent {
  id: number;
  name: string;
  department: string;
  sgpa: number;
}

interface ICGPALineGraph {
  labels: string[];
  values: number[];
}

interface IFAQ {
  question: string;
  answer: string;
}

interface IRecentlyAccessedCourse {
  id: number;
  title: string;
  instructor: string;
  date: string;
  time: string;
  progress: number;
  icon: string;
}

interface IMemberDashboard extends Document {
  userId: mongoose.Types.ObjectId;
  creditsDoughnutChart: ICreditsDoughnutChart;
  statisticsChart: IStatisticsChart;
  attendanceBarGraph: IAttendanceBarGraph;
  topStudents: ITopStudent[];
  cgpaLineGraph: ICGPALineGraph;
  frequentlyAskedQuestions: IFAQ[];
  recentlyAccessedCourses: IRecentlyAccessedCourse[];
}

// Schema
const MemberDashboardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  creditsDoughnutChart: {
    earnedCredits: { type: Number, default: 130 },
    totalCredits: { type: Number, default: 180 },
    size: { type: Number, default: 200 }
  },
  statisticsChart: {
    title: { type: String, default: 'Monthly Performance' },
    labels: { type: [String], default: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    values: { type: [Number], default: [75, 85, 90, 95] }
  },
  attendanceBarGraph: {
    labels: { type: [String], default: ['Math', 'Physics', 'Chemistry', 'CS', 'English'] },
    values: { type: [Number], default: [78, 85, 72, 80, 65] }
  },
  topStudents: {
    type: [{
      id: Number,
      name: String,
      department: String,
      sgpa: Number
    }],
    default: [
      { id: 1, name: 'John Doe', department: 'CSE', sgpa: 9.8 },
      { id: 2, name: 'Alice Smith', department: 'ECE', sgpa: 9.5 },
      { id: 3, name: 'Michael', department: 'MECH', sgpa: 9.3 }
    ]
  },
  cgpaLineGraph: {
    labels: { type: [String], default: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'] },
    values: { type: [Number], default: [9.0, 7.8, 8.3, 9.0, 8.1, 8.5] }
  },
  frequentlyAskedQuestions: {
    type: [{
      question: String,
      answer: String
    }],
    default: [
      {
        question: 'How do I reset my password?',
        answer: 'Go to account settings, click on \'Change Password\', and follow the instructions.'
      },
      {
        question: 'Where can I access course materials?',
        answer: 'All materials are available under the \'My Courses\' section.'
      },
      {
        question: 'How can I contact support?',
        answer: 'You can reach out via email at support@university.com or through live chat.'
      },
      {
        question: 'Are certificates provided?',
        answer: 'Yes, after successfully completing a course, a certificate is issued.'
      }
    ]
  },
  recentlyAccessedCourses: {
    type: [{
      id: Number,
      title: String,
      instructor: String,
      date: String,
      time: String,
      progress: Number,
      icon: String
    }],
    default: [
      {
        id: 1,
        title: 'Data Structures & Algorithms',
        instructor: 'Dr. Alice Johnson',
        date: 'Mar 10',
        time: '3h 45m',
        progress: 40,
        icon: '📂'
      },
      {
        id: 2,
        title: 'Machine Learning',
        instructor: 'Prof. David Kim',
        date: 'Apr 5',
        time: '5h 15m',
        progress: 65,
        icon: '🤖'
      },
      {
        id: 3,
        title: 'Cybersecurity Basics',
        instructor: 'Dr. Emma Carter',
        date: 'May 22',
        time: '4h 30m',
        progress: 85,
        icon: '🔐'
      }
    ]
  }
}, {
  timestamps: true
});

export const MemberDashboard = mongoose.model<IMemberDashboard>('MemberDashboard', MemberDashboardSchema); 