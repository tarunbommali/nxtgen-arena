import { Check, X, MoreHorizontal } from 'lucide-react';

export function DataTable({ data, onAction }) {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Education</th>
                            <th className="px-6 py-4">Skills</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No students found matching filters.
                                </td>
                            </tr>
                        ) : data.map((student) => (
                            <tr key={student.userId} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{student.fullName}</div>
                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                    <div className="text-xs text-muted-foreground">{student.whatsapp}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${student.status === 'approved' || student.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                            student.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {student.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white">{student.graduation}</div>
                                    <div className="text-xs text-muted-foreground">{student.specialization} - {student.year}</div>
                                    <div className="text-xs text-muted-foreground font-mono mt-1">{student.regNumber}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                        {student.skills?.slice(0, 3).map(skill => (
                                            <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/5">
                                                {skill}
                                            </span>
                                        ))}
                                        {student.skills?.length > 3 && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 border border-white/5 font-medium">
                                                +{student.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onAction(student.userId, 'approve')}
                                            className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => onAction(student.userId, 'reject')}
                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                            title="Reject"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
