import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { paymentAPI, eventAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegistrationModal({ event, isOpen, onClose, onSuccess }) {
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1); // 1: Details, 2: Payment (if paid), 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [teamName, setTeamName] = useState('');
    const [memberEmails, setMemberEmails] = useState(['']); // Start with 1 empty email
    const [members, setMembers] = useState([]); // Validated member data

    const isTeamEvent = event.isTeamEvent;
    const isPaid = event.isPaid;
    const amount = event.registrationFee;

    // Reset state when closing
    const handleClose = () => {
        setStep(1);
        setTeamName('');
        setMemberEmails(['']);
        setMembers([]);
        setError('');
        onClose();
    };

    const handleEmailChange = (index, value) => {
        const newEmails = [...memberEmails];
        newEmails[index] = value;
        setMemberEmails(newEmails);
    };

    const addMemberField = () => {
        if (memberEmails.length < (event.maxTeamSize || 4) - 1) { // -1 because current user is included
            setMemberEmails([...memberEmails, '']);
        }
    };

    const removeMemberField = (index) => {
        const newEmails = [...memberEmails];
        newEmails.splice(index, 1);
        setMemberEmails(newEmails);
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleRegistration = async () => {
        setError('');
        setLoading(true);

        try {
            // Validation
            if (isTeamEvent) {
                if (!teamName.trim()) throw new Error("Team name is required");
                if (memberEmails.some(e => !e.trim())) throw new Error("Please fill all member emails");

                // TODO: Validate emails via API if needed
                // For now, we'll just proceed
            }

            const registrationData = {
                eventId: event.id,
                participationType: isTeamEvent ? 'team' : 'individual',
                teamName: isTeamEvent ? teamName : undefined,
                members: isTeamEvent ? memberEmails.filter(e => e.trim()) : undefined
            };

            if (isPaid) {
                // Payment Flow
                const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

                if (!res) {
                    throw new Error('Razorpay SDK failed to load. Are you online?');
                }

                // Create Order
                const { data: orderData } = await paymentAPI.createOrder({
                    eventId: event.id,
                    teamId: undefined // Will be created during registration
                });

                if (!orderData.success) {
                    throw new Error(orderData.error?.message || 'Failed to create payment order');
                }

                const options = {
                    key: orderData.data.keyId,
                    amount: orderData.data.amount,
                    currency: orderData.data.currency,
                    name: 'NxtGen Arena',
                    description: `Registration for ${event.title}`,
                    order_id: orderData.data.orderId,
                    handler: async function (response) {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                eventId: event.id,
                                ...registrationData
                            };

                            const { data: verifyRes } = await paymentAPI.verifyPayment(verifyData);

                            if (verifyRes.success) {
                                setStep(3); // Success
                                if (onSuccess) onSuccess();
                            } else {
                                setError('Payment verification failed');
                            }
                        } catch (err) {
                            setError(err.response?.data?.error?.message || 'Payment verification failed');
                        }
                    },
                    prefill: {
                        name: currentUser.displayName,
                        email: currentUser.email,
                    },
                    theme: {
                        color: '#4A90E2',
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // Free Registration Flow
                const { data } = await eventAPI.register(event.id, registrationData);

                if (data.success) {
                    setStep(3); // Success
                    if (onSuccess) onSuccess();
                }
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold">
                            {step === 3 ? 'Registration Successful' : `Register for ${event.title || event.name}`}
                        </h2>
                        <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {step === 3 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">You're In! 🚀</h3>
                                <p className="text-muted-foreground mb-6">
                                    Registration confirmed. Check your email for details.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Participation Type Info */}
                                <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="shrink-0 p-2 bg-primary/10 rounded-lg">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Participation Type</p>
                                        <p className="text-muted-foreground text-sm">
                                            {isTeamEvent ? 'Team Participation' : 'Individual Participation'}
                                        </p>
                                    </div>
                                </div>

                                {/* Team Details Form */}
                                {isTeamEvent && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">Team Name</label>
                                            <input
                                                type="text"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                className="w-full p-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                                                placeholder="e.g. Code Ninjas"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="block text-sm font-medium">Team Members</label>
                                                <button
                                                    onClick={addMemberField}
                                                    disabled={memberEmails.length >= (event.maxTeamSize - 1)}
                                                    className="text-xs text-primary hover:underline disabled:opacity-50"
                                                >
                                                    + Add Member
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Enter email addresses of registered users</p>

                                            {memberEmails.map((email, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                                        className="w-full p-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm"
                                                        placeholder={`Member ${index + 2} Email`}
                                                    />
                                                    <button
                                                        onClick={() => removeMemberField(index)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Info */}
                                {isPaid && (
                                    <div className="flex justify-between items-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-sm">Registration Fee</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {isTeamEvent ? 'Per Team' : 'Per Person'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-lg font-bold">
                                            ₹ {amount}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRegistration}
                                        disabled={loading}
                                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                                        {isPaid ? `Pay ₹${amount} & Register` : 'Confirm Registration'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
