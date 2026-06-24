"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/actions/auth";
import { COLLEGE_DEPARTMENTS, getCollegeForDepartment } from "@/lib/college-data";

const LEVELS = ['100', '200', '300', '400', '500'] as const;
const COLLEGES = [
    { value: 'CBAS', label: 'CBAS — College of Basic and Applied Sciences' },
    { value: 'CHMS', label: 'CHMS — College of Humanities and Management Services' },
    { value: 'CAHS', label: 'CAHS — College of Allied Health Services' },
] as const;
const ALL_DEPARTMENTS = Object.values(COLLEGE_DEPARTMENTS).flat();

export default function SignUpForm() {
    const [type, setType] = useState<'student_email' | 'special_id'>('student_email');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const suggestedEmail = useMemo(() => {
        if (type !== 'student_email' || !firstName || !lastName) return '';
        return `${firstName.toLowerCase()}${lastName.toLowerCase()}@mtu.edu.ng`;
    }, [type, firstName, lastName]);

    const emailMismatch = useMemo(() => {
        if (type !== 'student_email' || !email || !suggestedEmail) return false;
        return email.toLowerCase() !== suggestedEmail;
    }, [type, email, suggestedEmail]);

    const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
        if (!pw) return { label: '', color: '', width: '0%' };
        if (pw.length < 6) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
        if (pw.length < 10) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)) return { label: 'Strong', color: 'bg-amber-500', width: '100%' };
        return { label: 'Good', color: 'bg-amber-400', width: '75%' };
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formErrors: Record<string, string> = {};

        if (password.length < 8) formErrors.password = 'Password must be at least 8 characters';
        if (password !== confirmPassword) formErrors.confirmPassword = 'Passwords do not match';

        if (type === 'student_email') {
            const expected = `${firstName.toLowerCase()}${lastName.toLowerCase()}@mtu.edu.ng`;
            if (email.toLowerCase() !== expected) {
                formErrors.email = `Email must be ${firstName.toLowerCase()}${lastName.toLowerCase()}@mtu.edu.ng`;
            }
        }

        if (Object.keys(formErrors).length > 0) {
            e.preventDefault();
            setErrors(formErrors);
        } else {
            setErrors({});
        }
    };

    const strength = getPasswordStrength(password);

    return (
        <form action={signUpAction} onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="type" value={type} />

            <div className="flex p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl mb-8">
                <button
                    type="button"
                    onClick={() => setType('student_email')}
                    className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                        type === 'student_email' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    MTU Student
                </button>
                <button
                    type="button"
                    onClick={() => setType('special_id')}
                    className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all uppercase tracking-widest ${
                        type === 'special_id' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    External Member
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                        First Name
                    </label>
                    <input
                        name="firstName"
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                        Surname
                    </label>
                    <input
                        name="lastName"
                        id="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="gender" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                        Gender
                    </label>
                    <select
                        name="gender"
                        id="gender"
                        required
                        className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 appearance-none text-sm"
                    >
                        <option value="" className="bg-slate-900 text-slate-500">Select</option>
                        <option value="male" className="bg-slate-900 text-white">Male</option>
                        <option value="female" className="bg-slate-900 text-white">Female</option>
                        <option value="other" className="bg-slate-900 text-white">Other</option>
                    </select>
                </div>
                {type === 'student_email' && (
                    <div className="space-y-2">
                        <label htmlFor="level" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                            Level
                        </label>
                        <select
                            name="level"
                            id="level"
                            required
                            className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 appearance-none text-sm"
                        >
                            <option value="" className="bg-slate-900 text-slate-500">Select</option>
                            {LEVELS.map((l) => (
                                <option key={l} value={l} className="bg-slate-900 text-white">{l}L</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {type === 'student_email' && (
                <>
                    <div className="space-y-2">
                        <label htmlFor="department" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                            Department
                        </label>
                        <select
                            name="department"
                            id="department"
                            required
                            className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 appearance-none text-sm"
                            onChange={(e) => {
                                const college = getCollegeForDepartment(e.target.value);
                                if (college) {
                                    const collegeSelect = document.getElementById('college') as HTMLSelectElement;
                                    if (collegeSelect) collegeSelect.value = college;
                                }
                            }}
                        >
                            <option value="" className="bg-slate-900 text-slate-500">Select department</option>
                            {ALL_DEPARTMENTS.map((d) => (
                                <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider px-1">
                            College auto-fills based on your department
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="college" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                            College
                        </label>
                        <select
                            name="college"
                            id="college"
                            required
                            className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 appearance-none text-sm"
                        >
                            <option value="" className="bg-slate-900 text-slate-500">Auto-filled from department</option>
                            {COLLEGES.map((c) => (
                                <option key={c.value} value={c.value} className="bg-slate-900 text-white">{c.label}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <div className="space-y-2">
                <label htmlFor="identifier" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                    {type === 'student_email' ? 'MTU Student Email' : 'Special Access ID'}
                </label>
                {type === 'student_email' ? (
                    <input
                        key="email-input"
                        name="identifier"
                        id="identifier"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="firstnamelastname@mtu.edu.ng"
                        className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                    />
                ) : (
                    <input
                        key="id-input"
                        name="identifier"
                        id="identifier"
                        type="text"
                        required
                        placeholder="MTU-EXT-XXXXXX"
                        className="w-full py-3.5 px-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 text-sm"
                    />
                )}
                {type === 'student_email' && suggestedEmail && (
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-2 px-1 ${
                        emailMismatch && email ? 'text-red-400' : 'text-slate-500'
                    }`}>
                        {emailMismatch && email
                            ? `Expected: ${suggestedEmail}`
                            : `Your email should be: ${suggestedEmail}`}
                    </p>
                )}
                {errors.email && (
                    <p className="text-xs text-red-400 font-bold mt-1 px-1">{errors.email}</p>
                )}
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider px-1">
                    {type === 'student_email'
                        ? 'Must match your firstnamelastname@mtu.edu.ng'
                        : 'Unique ID provided by admin'}
                </p>
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                    Password
                </label>
                <input
                    name="password"
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                />
                {password && (
                    <div className="mt-2 px-1">
                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                            strength.label === 'Strong' ? 'text-amber-400' :
                            strength.label === 'Good' ? 'text-amber-400' :
                            strength.label === 'Fair' ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                            {strength.label && `Password strength: ${strength.label}`}
                        </p>
                    </div>
                )}
                {errors.password && (
                    <p className="text-xs text-red-400 font-bold mt-1 px-1">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-slate-300 text-xs font-bold uppercase tracking-widest px-1">
                    Confirm Password
                </label>
                <input
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-slate-600 focus:bg-white/[0.06] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300"
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-400 font-bold mt-1 px-1">{errors.confirmPassword}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full py-4 mt-4 text-sm font-bold tracking-wider uppercase bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl shadow-xl shadow-amber-500/10 transition-all duration-300"
            >
                Create Account
            </Button>
        </form>
    );
}
