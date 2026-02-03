import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload, Calendar as CalendarIcon, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// --- Helper Components ---

// Simulated Image Upload Component
const ImageUpload = ({ value, onChange, placeholder = "Image URL" }) => {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(value);

    // Sync internal preview with external value
    useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would upload to server here.
            // For now, we use a local object URL for immediate graceful preview.
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onChange(objectUrl);
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:border-primary focus:outline-none"
                    />
                    <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white px-3 py-2 rounded-lg border border-white/10 transition-colors"
                    title="Upload Image"
                >
                    <Upload className="w-4 h-4" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            {preview && (
                <div className="mt-2 relative group w-full h-32 bg-black/20 rounded-lg overflow-hidden border border-white/10">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setPreview('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
};

// Reusable Dynamic List Component with Rich Features
const DynamicList = ({ label, items, onChange, fields, renderItem }) => {
    const handleAdd = () => {
        const newItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {});
        onChange([...items, newItem]);
    };

    const handleRemove = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    // Drag and drop functionality (simplified for now)
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("itemIndex", index);
    };

    const handleDrop = (e, newIndex) => {
        const draggedIndex = parseInt(e.dataTransfer.getData("itemIndex"));
        const newItems = [...items];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(newIndex, 0, draggedItem);
        onChange(newItems);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                    <Plus className="w-3 h-3" /> Add Item
                </button>
            </div>
            <div className="space-y-3">
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/5 border border-white/10 rounded-lg p-3 relative group flex items-start gap-2"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                        >
                            <div className="flex-shrink-0 pt-1 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-grow grid gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="grid gap-3">
                                    {fields.map((field) => (
                                        <div key={field.name} className={field.fullWidth ? "col-span-full" : ""}>
                                            {field.type === 'image' ? (
                                                <ImageUpload
                                                    value={item[field.name]}
                                                    onChange={(val) => handleChange(index, field.name, val)}
                                                    placeholder={field.placeholder}
                                                />
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    placeholder={field.placeholder}
                                                    value={item[field.name] || ''}
                                                    onChange={(e) => handleChange(index, field.name, e.target.value)}
                                                    className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none min-h-[80px]"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    placeholder={field.placeholder}
                                                    value={item[field.name] || ''}
                                                    onChange={(e) => handleChange(index, field.name, e.target.value)}
                                                    className="w-full bg-background/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {items.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4 bg-white/5 rounded-lg border border-dashed border-white/10">
                        No items added yet.
                    </p>
                )}
            </div>
        </div>
    );
};

// --- Main Form Component ---

export default function EventForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(initialData || {
        title: '',
        slug: '',
        description: '', // HTML content from quill
        rules: '', // HTML content from quill
        eventType: 'hackathon',
        status: 'draft',
        eventStart: '',
        eventEnd: '',
        registrationDeadline: '',
        bannerImage: '',
        jury: [],
        mentors: [],
        partners: [],
        faqs: [],
        schedule: [],
        sectionOrder: ['about', 'challenges', 'timeline', 'jury', 'mentors', 'prizes', 'partners', 'faqs']
    });

    const [activeSection, setActiveSection] = useState('basic');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // React Quill Modules configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
                {['Basic Info', 'Details & Rules', 'Media', 'Schedule', 'Dynamic Sections', 'Layout'].map((section, idx) => {
                    const id = ['basic', 'details', 'media', 'schedule', 'dynamic', 'layout'][idx];
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveSection(id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === id ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-white/5'
                                }`}
                        >
                            {section}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                {activeSection === 'basic' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Event Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug || ''}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                    placeholder="event-slug-2026"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                                <select
                                    value={formData.eventType}
                                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                >
                                    <option value="hackathon">Hackathon</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="webinar">Webinar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Mode</label>
                                <select
                                    value={formData.mode || 'online'}
                                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                >
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'details' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                            <div className="bg-background rounded-lg overflow-hidden border border-border">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(content) => setFormData({ ...formData, description: content })}
                                    modules={quillModules}
                                    className="text-foreground"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Rules & Guidelines</label>
                            <div className="bg-background rounded-lg overflow-hidden border border-border">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.rules}
                                    onChange={(content) => setFormData({ ...formData, rules: content })}
                                    modules={quillModules}
                                    className="text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'media' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Banner Image</label>
                            <ImageUpload
                                value={formData.bannerImage}
                                onChange={(val) => setFormData({ ...formData, bannerImage: val })}
                                placeholder="https://example.com/banner.jpg"
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'schedule' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.eventStart ? new Date(formData.eventStart).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setFormData({ ...formData, eventStart: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.eventEnd ? new Date(formData.eventEnd).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setFormData({ ...formData, eventEnd: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <DynamicList
                            label="Event Timeline / Schedule"
                            items={formData.schedule || []}
                            onChange={(newItems) => setFormData({ ...formData, schedule: newItems })}
                            fields={[
                                { name: 'time', placeholder: 'Time (e.g. 10:00 AM)' },
                                { name: 'title', placeholder: 'Activity Title' },
                                { name: 'track', placeholder: 'Track (e.g. Main Stage, Workshop)' },
                                { name: 'description', placeholder: 'Description', type: 'textarea', fullWidth: true }
                            ]}
                        />
                    </div>
                )}

                {activeSection === 'dynamic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DynamicList
                            label="Jury Members"
                            items={formData.jury || []}
                            onChange={(newItems) => setFormData({ ...formData, jury: newItems })}
                            fields={[
                                { name: 'name', placeholder: 'Name' },
                                { name: 'role', placeholder: 'Role' },
                                { name: 'company', placeholder: 'Company' },
                                { name: 'image', placeholder: 'Image URL', type: 'image' }
                            ]}
                        />
                        <DynamicList
                            label="Mentors"
                            items={formData.mentors || []}
                            onChange={(newItems) => setFormData({ ...formData, mentors: newItems })}
                            fields={[
                                { name: 'name', placeholder: 'Name' },
                                { name: 'expertise', placeholder: 'Expertise' },
                                { name: 'company', placeholder: 'Company' },
                                { name: 'image', placeholder: 'Image URL', type: 'image' }
                            ]}
                        />
                        <DynamicList
                            label="Partners"
                            items={formData.partners || []}
                            onChange={(newItems) => setFormData({ ...formData, partners: newItems })}
                            fields={[
                                { name: 'name', placeholder: 'Partner Name' },
                                { name: 'type', placeholder: 'Type (e.g. Platinum)' },
                                { name: 'logo', placeholder: 'Logo URL', type: 'image' }
                            ]}
                        />
                        <DynamicList
                            label="FAQs"
                            items={formData.faqs || []}
                            onChange={(newItems) => setFormData({ ...formData, faqs: newItems })}
                            fields={[
                                { name: 'question', placeholder: 'Question' },
                                { name: 'answer', placeholder: 'Answer' }
                            ]}
                        />
                    </div>
                )}

                {activeSection === 'layout' && (
                    <div className="space-y-4">
                        <div className="glass-card p-4 rounded-xl space-y-2">
                            <h4 className="font-bold text-sm mb-2">Page Section Order</h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                Drag and drop functionality coming soon. For now, edit the order manually if needed.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(formData.sectionOrder || ['about', 'challenges', 'timeline', 'jury', 'mentors', 'prizes', 'partners', 'faqs']).map((section, idx) => (
                                    <div key={section} className="px-3 py-1 bg-white/10 rounded-full text-sm border border-white/10 flex items-center gap-2">
                                        <span className="opacity-50 text-xs">{idx + 1}.</span> {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-4 mt-6 pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-primary/20"
                >
                    Save Event
                </button>
            </div>
        </form>
    );
}
