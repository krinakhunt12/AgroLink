/**
 * AccountSettings Component - User Security & Profile Dashboard
 * 
 * Provides a specialized interface for users to manage their identity,
 * session, and account lifecycle. 
 * 
 * DESIGN: Uses a structured 'Card' based layout with a clear visual 
 * hierarchy for standard management vs. high-risk actions.
 */

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { AlertTriangle, Trash2, ShieldAlert, ShieldCheck, LogOut, ArrowLeft, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dialog components for the high-stakes confirmation
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '../components/ui/dialog';

const AccountSettings: React.FC = () => {
    // 1. DATA LAYER - Connect to our customized Auth hook
    const { user, deleteAccount, isDeletingAccount, logout } = useAuth();
    const navigate = useNavigate();

    // local state for the 'DELETE' keyword confirmation input
    const [confirmText, setConfirmText] = useState('');

    /**
     * Logic: Only trigger the API if the user has manually typed 'delete'.
     * This acts as a 'Friction Barrier' to prevent accidental destruction.
     */
    const handleDeleteAccount = () => {
        if (confirmText.toLowerCase() === 'delete') {
            deleteAccount();
        }
    };

    return (
        <div className="bg-bg-base min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* PAGE HEADER */}
                <div className="flex items-center justify-between border-b border-border-base pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Access Control & Identity</h1>
                        <p className="text-text-muted text-sm italic">Securely manage your AgroLink digital footprint</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-text-muted hover:text-brand-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>

                <div className="grid gap-6">

                    {/* SECTION 1: IDENTITY OVERVIEW */}
                    <Card className="border-border-base bg-bg-surface shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="text-brand-primary" size={20} /> Identity Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-bg-muted/30 rounded-lg border border-border-subtle gap-2">
                                <div>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Registered Name</p>
                                    <p className="text-sm font-bold text-text-primary">{user?.name || 'Loading...'}</p>
                                </div>
                                <div className="text-right sm:text-right">
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left sm:text-right">System Designation</p>
                                    <p className="text-sm font-extrabold text-brand-primary uppercase tracking-tight">{user?.userType}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-bg-muted/30 rounded-lg border border-border-subtle">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Authentication Path</p>
                                <p className="text-sm font-medium text-text-primary">{user?.email || user?.phone || 'Connected Account'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: SESSION MANAGEMENT */}
                    <Card className="border-border-base bg-bg-surface shadow-sm border-l-4 border-l-status-info">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-status-info">
                                <ShieldAlert size={20} /> Current Session Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-text-muted leading-relaxed">
                                You are signed in via <span className="font-bold">{user?.loginMethod === 'google' ? 'Google OAuth 2.0' : 'Secure Phone Gateway'}</span>.
                                Your sessions are secured by JWT Bearer tokens with automated expiration.
                            </p>
                        </CardContent>
                        <CardFooter className="bg-bg-muted/20 border-t border-border-subtle py-4">
                            <Button variant="outline" className="border-status-info/30 text-status-info hover:bg-status-info/5 flex items-center gap-2 font-bold" onClick={logout}>
                                <LogOut size={16} /> Terminate Current Session
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* SECTION 3: GOVERNANCE & TRUST METRICS */}
                    <Card className="border-border-base bg-bg-surface shadow-sm border-l-4 border-l-brand-primary">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="text-brand-primary" size={20} /> Governance & Trust Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Verification</p>
                                <div className={`flex items-center gap-2 font-black uppercase text-xs mt-1 ${user?.isVerified ? 'text-status-success' : 'text-status-warning'}`}>
                                    {user?.isVerified ? (
                                        <><ShieldCheck size={14} /> Verified Farmer</>
                                    ) : (
                                        <><ShieldAlert size={14} /> Pending Verification</>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Marketplace Trust</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${user?.trustScore || 0}%` }}
                                        />
                                    </div>
                                    <span className="font-black text-sm text-text-primary">{user?.trustScore || 0}%</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">AI Risk Profile</p>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1 ${user?.riskLevel === 'high' ? 'bg-status-error/10 text-status-error' :
                                    user?.riskLevel === 'medium' ? 'bg-status-warning/10 text-status-warning' :
                                        'bg-status-success/10 text-status-success'
                                    }`}>
                                    {user?.riskLevel || 'Checking...'} Risk
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-bg-muted/10 border-t border-border-subtle py-3">
                            <p className="text-[10px] text-text-muted italic">
                                * These metrics are dynamically updated by the <strong>AgroLink AI Policy Engine</strong> based on transaction integrity and behavioral audit logs.
                            </p>
                        </CardFooter>
                    </Card>

                    {/* SECTION 4: PERMANENT ACTIONS (DANGER ZONE) */}
                    <Card className="border-status-error/20 bg-status-error/5 shadow-md border-2 border-dashed">
                        <CardHeader className="border-b border-status-error/10">
                            <CardTitle className="text-lg flex items-center gap-2 text-status-error uppercase tracking-wider font-black">
                                <AlertTriangle size={20} /> Account Withdrawal
                            </CardTitle>
                            <CardDescription className="text-status-error/70 font-medium italic">
                                Be advised: Withdrawal procedures are finalized via manual confirmation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="space-y-1 flex-1">
                                    <h4 className="font-bold text-text-primary">Permanently Deactivate Account</h4>
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        This will immediately anonymize your platform records, de-list all marketplace products,
                                        and void your active bids. <strong>Trades currently in transit cannot be deleted.</strong>
                                    </p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="danger" className="bg-status-error hover:bg-status-error/90 font-bold px-8 shadow-lg shadow-status-error/20">
                                            <Trash2 className="mr-2 h-4 w-4" /> Withdraw My Identity
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md border-2 border-status-error shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-status-error flex items-center gap-2 font-black uppercase tracking-tight text-xl">
                                                Final Data Clearance
                                            </DialogTitle>
                                            <DialogDescription className="pt-4 space-y-4">
                                                <div className="p-3 bg-status-error/10 border border-status-error/30 rounded text-status-error font-bold text-xs">
                                                    SYSTEM ALERT: This action is non-recoverable. All AI insights and trade history associated with this identity will be anonymized.
                                                </div>
                                                <p className="text-sm font-medium text-text-primary">
                                                    To confirm you understand the permanence of this action, type <span className="text-status-error font-black underline decoration-2 offset-2">DELETE</span> below.
                                                </p>
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="py-4">
                                            <input
                                                type="text"
                                                className="w-full p-4 border-2 border-border-base rounded bg-bg-muted focus:border-status-error outline-none font-black text-center uppercase tracking-[0.3em] text-text-primary shadow-inner"
                                                placeholder="--- TYPE HERE ---"
                                                value={confirmText}
                                                onChange={(e) => setConfirmText(e.target.value)}
                                            />
                                        </div>

                                        <DialogFooter className="sm:justify-start gap-4">
                                            <Button
                                                type="button"
                                                variant="danger"
                                                className="flex-1 font-black uppercase tracking-widest h-14"
                                                disabled={confirmText.toLowerCase() !== 'delete' || isDeletingAccount}
                                                onClick={handleDeleteAccount}
                                            >
                                                {isDeletingAccount ? <Loader2 className="animate-spin mr-2" /> : <Trash2 className="mr-2 h-5 w-5" />}
                                                Authorize Deletion
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PROJECT FOOTER DISCLAIMER */}
                <div className="text-center pt-10 text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] leading-relaxed opacity-50 hover:opacity-100 transition-opacity">
                    <p>© 2026 AgroLink Distributed Marketplace Architecture</p>
                    <p className="mt-2 flex items-center justify-center gap-1.5">
                        <ShieldAlert size={10} /> Full-Stack Integrated Platform Integration
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
