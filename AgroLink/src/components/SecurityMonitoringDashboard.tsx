import React, { useState, useEffect } from 'react';
import {
    Shield,
    AlertTriangle,
    Activity,
    Users,
    Lock,
    TrendingUp,
    Filter,
    Download,
    RefreshCw,
    Eye,
    XCircle,
    CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

/**
 * SECURITY MONITORING DASHBOARD
 * 
 * Admin-only dashboard for monitoring security events and audit logs
 * 
 * Features:
 * - Real-time statistics
 * - Failed login tracking
 * - Suspicious activity alerts
 * - Event filtering
 * - Risk level visualization
 * - Activity trends
 */

interface DashboardStats {
    totalEvents: number;
    byOutcome: { _id: string; count: number }[];
    byRiskLevel: { _id: string; count: number }[];
    failedLogins: number;
    securityEvents: number;
}

interface AuditLog {
    eventId: string;
    timestamp: string;
    eventType: string;
    eventCategory: string;
    userName?: string;
    userRole?: string;
    action: string;
    outcome: string;
    riskLevel: string;
    ipAddress: string;
}

export const SecurityMonitoringDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [failedLogins, setFailedLogins] = useState<any[]>([]);
    const [suspicious, setSuspicious] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [timeRange, setTimeRange] = useState('24');
    const [eventCategory, setEventCategory] = useState('');
    const [riskLevel, setRiskLevel] = useState('');
    const [outcome, setOutcome] = useState('');

    /**
     * Fetch dashboard data
     */
    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);

            // Fetch all data in parallel
            const [statsRes, logsRes, failedRes, suspiciousRes, alertsRes] = await Promise.all([
                api.get(`/audit/dashboard/stats?hours=${timeRange}`),
                api.get(`/audit/logs?limit=20&eventCategory=${eventCategory}&riskLevel=${riskLevel}&outcome=${outcome}`),
                api.get(`/audit/security/failed-logins?hours=${timeRange}`),
                api.get('/audit/security/suspicious?limit=10'),
                api.get('/audit/alerts')
            ]);

            setStats(statsRes.data.data);
            setLogs(logsRes.data.logs || []);
            setFailedLogins(failedRes.data.data || []);
            setSuspicious(suspiciousRes.data.data || []);
            setAlerts(alertsRes.data.data || []);

        } catch (error: any) {
            console.error('[DASHBOARD-ERROR]', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);

        return () => clearInterval(interval);
    }, [timeRange, eventCategory, riskLevel, outcome]);

    /**
     * Get risk level color
     */
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'CRITICAL': return 'text-red-600 bg-red-100';
            case 'HIGH': return 'text-orange-600 bg-orange-100';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
            case 'LOW': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    /**
     * Get outcome icon
     */
    const getOutcomeIcon = (outcome: string) => {
        switch (outcome) {
            case 'SUCCESS': return <CheckCircle className="text-green-500" size={20} />;
            case 'FAILURE': return <XCircle className="text-red-500" size={20} />;
            case 'BLOCKED': return <Shield className="text-orange-500" size={20} />;
            default: return <Activity className="text-gray-500" size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <RefreshCw className="animate-spin" size={48} />
                <span className="ml-4 text-xl">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="security-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield size={36} />
                        Security Monitoring Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Real-time security event monitoring and audit log analysis
                    </p>
                </div>

                <button
                    onClick={fetchDashboardData}
                    disabled={refreshing}
                    className="refresh-btn"
                >
                    <RefreshCw className={refreshing ? 'animate-spin' : ''} size={20} />
                    Refresh
                </button>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="alerts-section">
                    <h2 className="section-title">
                        <AlertTriangle size={24} />
                        Active Security Alerts ({alerts.length})
                    </h2>
                    <div className="alerts-grid">
                        {alerts.map((alert, index) => (
                            <div key={index} className={`alert alert-${alert.severity.toLowerCase()}`}>
                                <div className="alert-header">
                                    <span className="alert-type">{alert.type}</span>
                                    <span className="alert-severity">{alert.severity}</span>
                                </div>
                                <p className="alert-message">{alert.message}</p>
                                <span className="alert-time">
                                    {new Date(alert.timestamp).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon bg-blue-100">
                        <Activity className="text-blue-600" size={32} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Events</h3>
                        <p className="stat-value">
                            {stats?.totalEvents?.[0]?.count || 0}
                        </p>
                        <span className="stat-label">Last {timeRange} hours</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-red-100">
                        <XCircle className="text-red-600" size={32} />
                    </div>
                    <div className="stat-content">
                        <h3>Failed Logins</h3>
                        <p className="stat-value text-red-600">
                            {stats?.failedLogins?.[0]?.count || 0}
                        </p>
                        <span className="stat-label">Suspicious: {failedLogins.filter(ip => ip.count >= 5).length}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-orange-100">
                        <Shield className="text-orange-600" size={32} />
                    </div>
                    <div className="stat-content">
                        <h3>Security Events</h3>
                        <p className="stat-value text-orange-600">
                            {stats?.securityEvents?.[0]?.count || 0}
                        </p>
                        <span className="stat-label">High-risk activities</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon bg-purple-100">
                        <Users className="text-purple-600" size={32} />
                    </div>
                    <div className="stat-content">
                        <h3>Suspicious Users</h3>
                        <p className="stat-value text-purple-600">
                            {suspicious.length}
                        </p>
                        <span className="stat-label">Flagged accounts</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <h2 className="section-title">
                    <Filter size={24} />
                    Filters
                </h2>
                <div className="filters-grid">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="1">Last Hour</option>
                        <option value="6">Last 6 Hours</option>
                        <option value="24">Last 24 Hours</option>
                        <option value="168">Last Week</option>
                    </select>

                    <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        <option value="AUTHENTICATION">Authentication</option>
                        <option value="AUTHORIZATION">Authorization</option>
                        <option value="SECURITY">Security</option>
                        <option value="DATA_ACCESS">Data Access</option>
                        <option value="PRIVACY">Privacy</option>
                    </select>

                    <select
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Risk Levels</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    <select
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Outcomes</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILURE">Failure</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>
                </div>
            </div>

            {/* Failed Logins Table */}
            {failedLogins.length > 0 && (
                <div className="table-section">
                    <h2 className="section-title">
                        <Lock size={24} />
                        Failed Login Attempts by IP
                    </h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>IP Address</th>
                                    <th>Attempts</th>
                                    <th>Last Attempt</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {failedLogins.slice(0, 10).map((ip, index) => (
                                    <tr key={index}>
                                        <td className="font-mono">{ip._id}</td>
                                        <td>
                                            <span className={`badge ${ip.count >= 5 ? 'badge-danger' : 'badge-warning'}`}>
                                                {ip.count} attempts
                                            </span>
                                        </td>
                                        <td>{new Date(ip.lastAttempt).toLocaleString()}</td>
                                        <td>
                                            {ip.count >= 5 ? (
                                                <span className="text-red-600 font-semibold">⚠️ Suspicious</span>
                                            ) : (
                                                <span className="text-yellow-600">Monitoring</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Audit Logs */}
            <div className="table-section">
                <h2 className="section-title">
                    <Eye size={24} />
                    Recent Audit Logs
                </h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Event Type</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Outcome</th>
                                <th>Risk</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.eventId}>
                                    <td className="text-sm">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td>
                                        <span className="badge badge-info">
                                            {log.eventType}
                                        </span>
                                    </td>
                                    <td>
                                        {log.userName || 'Unknown'}
                                        <br />
                                        <span className="text-xs text-gray-500">
                                            {log.userRole}
                                        </span>
                                    </td>
                                    <td className="text-sm">{log.action}</td>
                                    <td>{getOutcomeIcon(log.outcome)}</td>
                                    <td>
                                        <span className={`badge ${getRiskColor(log.riskLevel)}`}>
                                            {log.riskLevel}
                                        </span>
                                    </td>
                                    <td className="font-mono text-sm">{log.ipAddress}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .security-dashboard {
                    padding: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: #4299e1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .refresh-btn:hover:not(:disabled) {
                    background: #3182ce;
                }

                .refresh-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .alerts-section {
                    margin-bottom: 32px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 16px;
                }

                .alerts-grid {
                    display: grid;
                    gap: 16px;
                }

                .alert {
                    padding: 16px;
                    border-radius: 8px;
                    border-left: 4px solid;
                }

                .alert-high {
                    background: #fff5f5;
                    border-color: #fc8181;
                }

                .alert-critical {
                    background: #ffe5e5;
                    border-color: #e53e3e;
                }

                .alert-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .alert-type {
                    font-weight: 600;
                }

                .alert-severity {
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    background: #e53e3e;
                    color: white;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    display: flex;
                    gap: 16px;
                    padding: 24px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .stat-icon {
                    width: 64px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }

                .stat-content h3 {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 8px;
                }

                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .stat-label {
                    font-size: 12px;
                    color: #a0aec0;
                }

                .filters-section {
                    margin-bottom: 32px;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }

                .filter-select {
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .table-section {
                    margin-bottom: 32px;
                }

                .table-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    background: #f7fafc;
                    padding: 16px;
                    text-align: left;
                    font-weight: 600;
                    border-bottom: 2px solid #e2e8f0;
                }

                .data-table td {
                    padding: 16px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .data-table tr:hover {
                    background: #f7fafc;
                }

                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .badge-info {
                    background: #bee3f8;
                    color: #2c5282;
                }

                .badge-danger {
                    background: #fed7d7;
                    color: #c53030;
                }

                .badge-warning {
                    background: #feebc8;
                    color: #c05621;
                }
            `}</style>
        </div>
    );
};

export default SecurityMonitoringDashboard;
