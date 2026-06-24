export const COLLEGE_DEPARTMENTS: Record<string, string[]> = {
    CBAS: [
        'Computer Science', 'Software Engineering', 'Cyber Security',
        'Biology', 'Chemistry', 'GeoSciences', 'Microbiology',
        'Biochemistry', 'Biotechnology', 'Food and Nutrition',
        'Mathematics', 'Physics',
    ],
    CHMS: [
        'Accounting', 'Economics', 'Business Administration', 'Finance',
        'International Relations', 'Mass Communication', 'Languages',
        'Religion and Philosophy', 'Fine and Applied Arts', 'Public Administration',
    ],
    CAHS: [
        'Nursing', 'Medical Lab Sciences',
    ],
};

export const ALL_DEPARTMENTS = Object.values(COLLEGE_DEPARTMENTS).flat();

export function getCollegeForDepartment(dept: string): string | null {
    const normalized = dept.trim().toLowerCase();
    for (const [college, depts] of Object.entries(COLLEGE_DEPARTMENTS)) {
        if (depts.some(d => d.toLowerCase() === normalized)) {
            return college;
        }
    }
    return null;
}
