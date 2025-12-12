import { useState, useEffect } from 'react';
import { Activity, AlertCircle, TrendingUp, Server, Database, Zap } from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: string;
  icon: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  uptime: string;
  responseTime: string;
  lastCheck: string;
}

interface RecentIncident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  timestamp: string;
  affectedServices: string[];
}

interface Log {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
  service: string;
}

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [incidents, setIncidents] = useState<RecentIncident[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'incidents' | 'logs'>('overview');

  useEffect(() => {
    document.title = 'Régua Máxima | Monitoramento';
    loadMonitoringData();
  }, []);

  const loadMonitoringData = () => {
    // Mock de métricas do sistema
    setMetrics([
      {
        id: 'm1',
        name: 'CPU Usage',
        value: '45%',
        status: 'healthy',
        trend: '+2%',
        icon: 'cpu'
      },
      {
        id: 'm2',
        name: 'Memory',
        value: '68%',
        status: 'warning',
        trend: '+5%',
        icon: 'memory'
      },
      {
        id: 'm3',
        name: 'Disk Space',
        value: '72%',
        status: 'warning',
        trend: '+3%',
        icon: 'disk'
      },
      {
        id: 'm4',
        name: 'Network',
        value: '120 MB/s',
        status: 'healthy',
        trend: '-1%',
        icon: 'network'
      }
    ]);

    // Mock de status dos serviços
    setServices([
      {
        id: 's1',
        name: 'API Gateway',
        status: 'online',
        uptime: '99.98%',
        responseTime: '45ms',
        lastCheck: 'Há 30 segundos'
      },
      {
        id: 's2',
        name: 'Database Primary',
        status: 'online',
        uptime: '99.95%',
        responseTime: '12ms',
        lastCheck: 'Há 30 segundos'
      },
      {
        id: 's3',
        name: 'Cache Redis',
        status: 'online',
        uptime: '99.99%',
        responseTime: '3ms',
        lastCheck: 'Há 30 segundos'
      },
      {
        id: 's4',
        name: 'Queue Service',
        status: 'degraded',
        uptime: '98.50%',
        responseTime: '180ms',
        lastCheck: 'Há 30 segundos'
      },
      {
        id: 's5',
        name: 'Storage S3',
        status: 'online',
        uptime: '99.99%',
        responseTime: '95ms',
        lastCheck: 'Há 30 segundos'
      },
      {
        id: 's6',
        name: 'Email Service',
        status: 'online',
        uptime: '99.90%',
        responseTime: '250ms',
        lastCheck: 'Há 30 segundos'
      }
    ]);

    // Mock de incidentes recentes
    setIncidents([
      {
        id: 'i1',
        title: 'Aumento na latência do Queue Service',
        severity: 'medium',
        status: 'monitoring',
        timestamp: 'Há 15 minutos',
        affectedServices: ['Queue Service']
      },
      {
        id: 'i2',
        title: 'Pico de uso de memória detectado',
        severity: 'low',
        status: 'resolved',
        timestamp: 'Há 2 horas',
        affectedServices: ['API Gateway']
      },
      {
        id: 'i3',
        title: 'Timeout intermitente no Database',
        severity: 'high',
        status: 'resolved',
        timestamp: 'Há 5 horas',
        affectedServices: ['Database Primary', 'API Gateway']
      }
    ]);

    // Mock de logs recentes
    setLogs([
      {
        id: 'l1',
        level: 'info',
        message: 'Health check completed successfully',
        timestamp: '2025-12-10 14:35:20',
        service: 'API Gateway'
      },
      {
        id: 'l2',
        level: 'warning',
        message: 'High memory usage detected: 68%',
        timestamp: '2025-12-10 14:34:15',
        service: 'System'
      },
      {
        id: 'l3',
        level: 'error',
        message: 'Queue processing delayed: backlog at 350 items',
        timestamp: '2025-12-10 14:33:45',
        service: 'Queue Service'
      },
      {
        id: 'l4',
        level: 'info',
        message: 'Database backup completed',
        timestamp: '2025-12-10 14:30:00',
        service: 'Database Primary'
      },
      {
        id: 'l5',
        level: 'debug',
        message: 'Cache hit rate: 94.5%',
        timestamp: '2025-12-10 14:29:30',
        service: 'Cache Redis'
      }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning':
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'critical':
      case 'offline':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-500/10 text-green-400 border-green-500/20',
      degraded: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      offline: 'bg-red-500/10 text-red-400 border-red-500/20',
      resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
      monitoring: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      investigating: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      identified: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      healthy: 'bg-green-500/10 text-green-400 border-green-500/20',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[status as keyof typeof colors] || colors.online;
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'debug':
        return 'text-gray-400';
      default:
        return 'text-text-dim';
    }
  };

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
            Monitoramento
          </h1>
          <p className="text-text-dim">Sistema de monitoramento e observabilidade</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">Sistema Operacional</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 animate-fade-in-delayed">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium transition-all relative ${
            activeTab === 'overview'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Activity className="w-4 h-4 inline-block mr-2" />
          Visão Geral
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-3 font-medium transition-all relative ${
            activeTab === 'services'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Server className="w-4 h-4 inline-block mr-2" />
          Serviços
          {activeTab === 'services' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-3 font-medium transition-all relative ${
            activeTab === 'incidents'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 inline-block mr-2" />
          Incidentes
          {activeTab === 'incidents' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-3 font-medium transition-all relative ${
            activeTab === 'logs'
              ? 'text-gold'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Database className="w-4 h-4 inline-block mr-2" />
          Logs
          {activeTab === 'logs' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
          )}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 animate-fade-in">
          {/* System Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Métricas do Sistema</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div key={metric.id} className="card card-hover group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-dim">{metric.name}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor(metric.status)}`}>
                      {metric.icon === 'cpu' && <Zap className="w-4 h-4" />}
                      {metric.icon === 'memory' && <Database className="w-4 h-4" />}
                      {metric.icon === 'disk' && <Server className="w-4 h-4" />}
                      {metric.icon === 'network' && <TrendingUp className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-text">{metric.value}</p>
                      <p className="text-xs text-text-dim mt-1">Trend: {metric.trend}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs rounded-lg border ${getStatusBadge(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Status Summary */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Status dos Serviços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.slice(0, 6).map((service) => (
                <div key={service.id} className="card card-hover">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text">{service.name}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'online' ? 'bg-green-400' :
                      service.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                    } ${service.status === 'online' ? 'animate-pulse' : ''}`}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-text-dim">Uptime:</span>
                      <p className="text-text font-medium">{service.uptime}</p>
                    </div>
                    <div>
                      <span className="text-text-dim">Response:</span>
                      <p className="text-text font-medium">{service.responseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          <div>
            <h2 className="text-xl font-semibold text-text mb-4">Incidentes Recentes</h2>
            <div className="card">
              <div className="divide-y divide-border">
                {incidents.map((incident) => (
                  <div key={incident.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 text-xs rounded-lg border ${getSeverityBadge(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2.5 py-1 text-xs rounded-lg border ${getStatusBadge(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        <h3 className="text-text font-medium mb-1">{incident.title}</h3>
                        <p className="text-sm text-text-dim">
                          Afetando: {incident.affectedServices.join(', ')}
                        </p>
                      </div>
                      <span className="text-xs text-text-dim whitespace-nowrap">{incident.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="animate-fade-in">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text mb-2">Todos os Serviços</h2>
              <p className="text-sm text-text-dim">Monitoramento detalhado de cada serviço</p>
            </div>
            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service.id} className="p-4 rounded-xl border border-border hover:border-gold/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.status === 'online' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                        service.status === 'degraded' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
                        'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-text font-medium">{service.name}</h3>
                        <p className="text-xs text-text-dim">{service.lastCheck}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs rounded-lg border ${getStatusBadge(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-text-dim">Uptime</span>
                      <p className="text-sm text-text font-medium">{service.uptime}</p>
                    </div>
                    <div>
                      <span className="text-xs text-text-dim">Response Time</span>
                      <p className="text-sm text-text font-medium">{service.responseTime}</p>
                    </div>
                    <div>
                      <span className="text-xs text-text-dim">Status</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'online' ? 'bg-green-400 animate-pulse' :
                          service.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-xs text-text capitalize">{service.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="animate-fade-in">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text mb-2">Histórico de Incidentes</h2>
              <p className="text-sm text-text-dim">Todos os incidentes reportados e seu status</p>
            </div>
            <div className="divide-y divide-border">
              {incidents.map((incident) => (
                <div key={incident.id} className="py-6 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      incident.severity === 'critical' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                      incident.severity === 'high' ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' :
                      incident.severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                    }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-text font-medium mb-2">{incident.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-xs rounded-lg border ${getSeverityBadge(incident.severity)}`}>
                              Severidade: {incident.severity}
                            </span>
                            <span className={`px-2.5 py-1 text-xs rounded-lg border ${getStatusBadge(incident.status)}`}>
                              {incident.status}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-text-dim whitespace-nowrap">{incident.timestamp}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface border border-border">
                        <p className="text-xs text-text-dim mb-1">Serviços Afetados:</p>
                        <div className="flex flex-wrap gap-2">
                          {incident.affectedServices.map((service, idx) => (
                            <span key={idx} className="px-2 py-1 rounded text-xs bg-background border border-border text-text">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="animate-fade-in">
          <div className="card">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-text mb-2">Logs do Sistema</h2>
              <p className="text-sm text-text-dim">Registros detalhados de eventos do sistema</p>
            </div>
            <div className="bg-background rounded-xl border border-border p-4 font-mono text-sm">
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 py-2 hover:bg-surface/50 rounded px-2 -mx-2 transition-colors">
                    <span className="text-text-dim text-xs whitespace-nowrap shrink-0">
                      {log.timestamp}
                    </span>
                    <span className={`text-xs font-bold uppercase shrink-0 w-16 ${getLogLevelColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="text-xs text-gold shrink-0 w-32">
                      {log.service}
                    </span>
                    <span className="text-xs text-text flex-1">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
