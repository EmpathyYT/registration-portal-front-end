// import LogIn from './pages/LogIn';
// import 'bootstrap/dist/css/bootstrap.css'
// function App() {

//   return (
//     <LogIn/>
//   )
// }
// export default App


// Made for Registered course ↓

import React, { useState } from 'react';
import RegisteredCoursesTable from './components/registration/RegisteredCoursesTable';
import CourseSectionsTable from './components/registration/CourseSectionsTable';
import AvailableCoursesGrid, { type CourseSummary } from './components/registration/AvailableCoursesGrid';
import { type EnrolledCourse } from './components/registration/RegisteredCourseRow';
import { type CourseSection } from './components/registration/CourseSectionRow';

// 1. بيانات تجريبية للمواد المقترحة
const INITIAL_AVAILABLE_COURSES: CourseSummary[] = [
  { courseId: '30801342', courseName: 'تحليل وتصميم النظم', credits: 3 },
  { courseId: '30801427', courseName: 'معمارية الحاسوب', credits: 3 },
  { courseId: '30801211', courseName: 'تراكيب البيانات', credits: 3 },
  { courseId: '30801301', courseName: 'قواعد البيانات', credits: 3 },
];

// 2. بيانات تجريبية للشعب المتاحة حسب المادة
const MOCK_SECTIONS: Record<string, CourseSection[]> = {
  '30801342': [
    { semesterCourseId: 101, courseName: 'تحليل وتصميم النظم', instructor: 'عماد الشلبي', dayOfWeek: 'ح ن ث ر', lectureTime: '08:30 - 10:00', location: 'E202 / ONLINE 1' },
    { semesterCourseId: 102, courseName: 'تحليل وتصميم النظم', instructor: 'د. أحمد السالم', dayOfWeek: 'ن ث', lectureTime: '10:00 - 11:30', location: 'IT-105' },
  ],
  '30801427': [
    { semesterCourseId: 201, courseName: 'معمارية الحاسوب', instructor: 'خلدون عارف', dayOfWeek: 'ح ن ث ر', lectureTime: '11:30 - 13:00', location: 'E302 / ONLINE 1' },
  ],
  '30801211': [
    { semesterCourseId: 301, courseName: 'تراكيب البيانات', instructor: 'د. رانيا محمود', dayOfWeek: 'ح ث', lectureTime: '01:00 - 02:30', location: 'Lab 4' },
  ],
  '30801301': [
    { 
      semesterCourseId: 401, 
      courseName: 'قواعد البيانات', 
      instructor: 'د. خالد العمري', 
      dayOfWeek: 'ح ن ث ر', 
      lectureTime: '09:30 - 10:30', 
      location: 'Lab 2' 
    },
    { 
      semesterCourseId: 402, 
      courseName: 'قواعد البيانات', 
      instructor: 'د. منار عيسى', 
      dayOfWeek: 'ن ث', 
      lectureTime: '12:00 - 01:30', 
      location: 'IT-201' 
    },
  ],
};

function App() {
  // حالة المواد المسجلة
  const [registeredCourses, setRegisteredCourses] = useState<EnrolledCourse[]>([
    {
      semesterCourseId: 999,
      courseId: '30801100',
      courseName: 'مقدمة في البرمجة',
      credits: 3,
      lectureTime: '08:30 - 10:00',
      dayOfWeek: 'ح ن ث ر',
      instructor: 'د. محمد علي',
      location: 'C101',
    },
  ]);

  // حالة المادة المختارة حالياً لعرض شعبها
  const [selectedCourseId, setSelectedCourseId] = useState<string>('30801342');

  // حساب إجمالي الساعات المسجلة
  const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);

  // اختيار مادة لعرض شعبها
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  // إضافة شعبة للمواد المسجلة
  const handleAddSection = (semesterCourseId: string | number) => {
     // البحث عن الشعبة المختارة
    const currentSections = MOCK_SECTIONS[selectedCourseId] || [];
    const sectionToAdd = currentSections.find(s => s.semesterCourseId === semesterCourseId);
    const courseInfo = INITIAL_AVAILABLE_COURSES.find(c => c.courseId === selectedCourseId);

    if (!sectionToAdd || !courseInfo) return;

    const isAlreadyRegistered = registeredCourses.some(c => c.courseId === selectedCourseId);
    if (isAlreadyRegistered) {
      alert('هذه المادة مسجلة بالفعل!');
      setSelectedCourseId(''); // يعيدك لأول شيء حتى لو المادة مسجلة مسبقاً
      return;
    }

    const newCourse: EnrolledCourse = {
      semesterCourseId: sectionToAdd.semesterCourseId,
      courseId: courseInfo.courseId,
      courseName: courseInfo.courseName,
      credits: courseInfo.credits,
      lectureTime: sectionToAdd.lectureTime,
      dayOfWeek: sectionToAdd.dayOfWeek,
      instructor: sectionToAdd.instructor,
      location: sectionToAdd.location,
    };

    setRegisteredCourses([...registeredCourses, newCourse]);
    alert(`تمت إضافة مادة ${courseInfo.courseName} بنجاح!`);
    
    // إعادة التحديد للحالة الأولى
    setSelectedCourseId('');
  };

  // إسقاط/حذف مادة مسجلة
  const handleDropCourse = (semesterCourseId: string | number) => {
    setRegisteredCourses(registeredCourses.filter(c => c.semesterCourseId !== semesterCourseId));
  };

  return (
    <div className="container my-5" dir="rtl">
      {/* هيدر الصفحة وملخص الساعات */}
      <div className="card shadow-sm mb-4 bg-light">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">بوابة تسجيل المواد الدراسية</h2>
            <p className="text-muted mb-0">اختر المواد والشعب المناسبة لجدولك الدراسي</p>
          </div>
          <div className="text-end">
            <span className="badge bg-primary fs-6 p-2">
              إجمالي الساعات المسجلة: {totalCredits} ساعة
            </span>
          </div>
        </div>
      </div>

      {/* 1. جدول المواد المسجلة */}
      <RegisteredCoursesTable
        courses={registeredCourses}
        onDropCourse={handleDropCourse}
      />

      {/* 2. شبكة المواد المقترحة للبحث */}
      <AvailableCoursesGrid
        courses={INITIAL_AVAILABLE_COURSES}
        selectedCourseId={selectedCourseId}
        onSelectCourse={handleSelectCourse}
      />

    {/* 3. جدول الشعب المتاحة للمادة المختارة */}
      {selectedCourseId ? (
        <div>
          <div className="alert alert-primary text-center mb-3 fw-bold">
            الشعب المتاحة لمادة: {INITIAL_AVAILABLE_COURSES.find(c => c.courseId === selectedCourseId)?.courseName} ({selectedCourseId})
          </div>
          <CourseSectionsTable
            sections={MOCK_SECTIONS[selectedCourseId] || []}
            onAddSection={handleAddSection}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;