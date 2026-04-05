/**
 * Design: Precision Agriculture Dashboard
 * Paleta: Verde-escuro (#166534) primário, branco/cinza base, âmbar para alertas
 * Fontes: Sora (display) + Source Sans 3 (corpo) + JetBrains Mono (código)
 * Layout: Sidebar fixa + conteúdo principal com tabs por API e acordeões por endpoint
 */

import { useState, useMemo } from "react";
import apiData, { ApiCategory, ApiEndpoint } from "@/lib/apiData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  ChevronRight,
  Code2,
  Database,
  Layers,
  Shield,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Info,
  BookOpen,
  Cpu,
  Wifi,
  MapPin,
  Zap,
  BarChart3,
} from "lucide-react";

// ---- Helpers ----
function getTypeBadgeClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("string")) return "badge-string";
  if (t.includes("integer") || t.includes("int")) return "badge-integer";
  if (t.includes("double") || t.includes("float")) return "badge-double";
  if (t.includes("boolean") || t.includes("bool")) return "badge-boolean";
  if (t.includes("datetime") || t.includes("date")) return "badge-datetime";
  if (t.includes("object")) return "badge-object";
  if (t.includes("array")) return "badge-array";
  if (t.includes("long")) return "badge-long";
  if (t.includes("uuid")) return "badge-uuid";
  return "badge-string";
}

function getMethodBadgeClass(method: string): string {
  switch (method.toUpperCase()) {
    case "GET": return "method-get";
    case "POST": return "method-post";
    case "PATCH": return "method-patch";
    case "DELETE": return "method-delete";
    case "SOAP": return "badge-object";
    default: return "badge-string";
  }
}

function ApiIcon({ apiId }: { apiId: string }) {
  switch (apiId) {
    case "john-deere": return <Cpu className="w-5 h-5" />;
    case "trackunit": return <Wifi className="w-5 h-5" />;
    case "hitachi": return <Layers className="w-5 h-5" />;
    case "proemion": return <Database className="w-5 h-5" />;
    default: return <Code2 className="w-5 h-5" />;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
      title="Copiar código"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [activeTab, setActiveTab] = useState("fields");

  return (
    <AccordionItem
      value={endpoint.id}
      className="border border-border rounded-lg mb-3 overflow-hidden shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-secondary/50 transition-colors [&>svg]:hidden">
        <div className="flex items-start gap-3 w-full text-left">
          <span
            className={`text-xs font-mono font-semibold px-2 py-1 rounded shrink-0 mt-0.5 ${getMethodBadgeClass(endpoint.method)}`}
          >
            {endpoint.method}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-sm font-mono text-foreground font-medium break-all">
                {endpoint.path}
              </code>
              {endpoint.oauthScope && (
                <span className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground rounded font-mono">
                  scope: {endpoint.oauthScope}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 font-normal line-clamp-2">
              {endpoint.description}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <span>{endpoint.fields.length} campos</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        <div className="border-t border-border">
          {/* Description */}
          <div className="px-4 py-3 bg-secondary/30">
            <p className="text-sm text-foreground leading-relaxed">{endpoint.description}</p>
            {endpoint.notes && (
              <div className="mt-2 flex gap-2 items-start p-2 bg-accent/50 rounded text-xs text-accent-foreground">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{endpoint.notes}</span>
              </div>
            )}
          </div>

          {/* Tabs: Fields / JSON Example */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none border-b border-border bg-secondary/20 h-9 px-4 justify-start gap-1">
              <TabsTrigger value="fields" className="text-xs h-7 data-[state=active]:bg-background">
                <Database className="w-3 h-3 mr-1" />
                Campos ({endpoint.fields.length})
              </TabsTrigger>
              {endpoint.jsonExample && (
                <TabsTrigger value="json" className="text-xs h-7 data-[state=active]:bg-background">
                  <Code2 className="w-3 h-3 mr-1" />
                  Exemplo JSON
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="fields" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[22%]">
                        Campo
                      </th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[10%]">
                        Tipo
                      </th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[28%]">
                        Descrição
                      </th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[18%]">
                        Exemplo
                      </th>
                      <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-[22%]">
                        Uso Pragmático
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.fields.map((field, i) => (
                      <tr
                        key={field.field}
                        className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                          i % 2 === 0 ? "" : "bg-secondary/10"
                        }`}
                      >
                        <td className="px-4 py-2.5 align-top">
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs font-mono text-primary font-medium break-all">
                              {field.field}
                            </code>
                            {field.required && (
                              <span className="text-[10px] text-destructive font-semibold">*</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <span
                            className={`text-[11px] font-mono px-1.5 py-0.5 rounded font-medium ${getTypeBadgeClass(
                              field.type
                            )}`}
                          >
                            {field.type}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 align-top text-xs text-foreground leading-relaxed">
                          {field.description}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <code className="text-[11px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded break-all">
                            {field.example}
                          </code>
                        </td>
                        <td className="px-3 py-2.5 align-top text-xs text-muted-foreground leading-relaxed">
                          {field.pragmaticUse}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {endpoint.jsonExample && (
              <TabsContent value="json" className="mt-0 p-4">
                <div className="relative">
                  <pre className="json-block text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {endpoint.jsonExample}
                  </pre>
                  <CopyButton text={endpoint.jsonExample} />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function ApiPanel({ api }: { api: ApiCategory }) {
  const [search, setSearch] = useState("");

  const filteredEndpoints = useMemo(() => {
    if (!search.trim()) return api.endpoints;
    const q = search.toLowerCase();
    return api.endpoints.filter(
      (ep) =>
        ep.path.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q) ||
        ep.fields.some(
          (f) =>
            f.field.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q)
        )
    );
  }, [api.endpoints, search]);

  return (
    <div className="space-y-4">
      {/* API Header */}
      <div
        className="rounded-xl p-5 text-white"
        style={{ background: `linear-gradient(135deg, ${api.color}ee, ${api.color}99)` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{api.icon}</span>
              <h2 className="text-xl font-display font-bold">{api.name}</h2>
            </div>
            <p className="text-white/85 text-sm leading-relaxed max-w-3xl">
              {api.description}
            </p>
          </div>
          <a
            href={api.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Documentação
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <Shield className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/90">{api.authType}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <Code2 className="w-3.5 h-3.5 text-white/70" />
            <code className="text-xs text-white/90 font-mono">{api.baseUrl}</code>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <Layers className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs text-white/90">{api.endpoints.length} endpoints</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={`Pesquisar endpoints e campos em ${api.name}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-display font-bold text-primary">
            {api.endpoints.length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Endpoints</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-display font-bold text-primary">
            {api.endpoints.reduce((acc, ep) => acc + ep.fields.length, 0)}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Campos Mapeados</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-2xl font-display font-bold text-primary">
            {api.endpoints.filter((ep) => ep.jsonExample).length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Com Exemplos JSON</div>
        </div>
      </div>

      {/* Endpoints */}
      {filteredEndpoints.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhum endpoint encontrado para "{search}"</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-0">
          {filteredEndpoints.map((ep) => (
            <EndpointCard key={ep.id} endpoint={ep} />
          ))}
        </Accordion>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeApi, setActiveApi] = useState(apiData[0].id);
  const [globalSearch, setGlobalSearch] = useState("");

  const totalEndpoints = apiData.reduce((acc, api) => acc + api.endpoints.length, 0);
  const totalFields = apiData.reduce(
    (acc, api) => acc + api.endpoints.reduce((a, ep) => a + ep.fields.length, 0),
    0
  );

  const globalResults = useMemo(() => {
    if (!globalSearch.trim()) return null;
    const q = globalSearch.toLowerCase();
    return apiData.flatMap((api) =>
      api.endpoints
        .filter(
          (ep) =>
            ep.path.toLowerCase().includes(q) ||
            ep.description.toLowerCase().includes(q) ||
            ep.fields.some(
              (f) =>
                f.field.toLowerCase().includes(q) ||
                f.description.toLowerCase().includes(q) ||
                f.pragmaticUse.toLowerCase().includes(q)
            )
        )
        .map((ep) => ({ api, ep }))
    );
  }, [globalSearch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between h-14 gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-display font-bold text-foreground leading-tight">
                  Mapeamento de APIs
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Monitoramento de Máquinas Agrícolas
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Busca global em todas as APIs..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs font-mono">
                {apiData.length} APIs
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono">
                {totalEndpoints} endpoints
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono">
                {totalFields} campos
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Global search results */}
        {globalSearch.trim() && globalResults !== null && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                {globalResults.length} resultado(s) para "{globalSearch}"
              </h2>
            </div>
            {globalResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum resultado encontrado.
              </div>
            ) : (
              <div className="space-y-2">
                {globalResults.map(({ api, ep }) => (
                  <div
                    key={`${api.id}-${ep.id}`}
                    className="border border-border rounded-lg p-3 bg-card cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setGlobalSearch("");
                      setActiveApi(api.id);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs" style={{ color: api.color }}>
                        {api.icon} {api.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${getMethodBadgeClass(ep.method)}`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs font-mono text-foreground">{ep.path}</code>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ep.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats overview */}
        {!globalSearch.trim() && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<Cpu className="w-5 h-5" />}
              value={apiData.length}
              label="APIs Mapeadas"
              color="#166534"
            />
            <StatCard
              icon={<Layers className="w-5 h-5" />}
              value={totalEndpoints}
              label="Endpoints Documentados"
              color="#1d4ed8"
            />
            <StatCard
              icon={<Database className="w-5 h-5" />}
              value={totalFields}
              label="Campos Mapeados"
              color="#b45309"
            />
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              value={apiData.reduce(
                (acc, api) =>
                  acc + api.endpoints.filter((ep) => ep.jsonExample).length,
                0
              )}
              label="Exemplos JSON"
              color="#7c3aed"
            />
          </div>
        )}

        {/* Legend */}
        {!globalSearch.trim() && (
          <div className="mb-5 p-3 bg-secondary/30 rounded-lg border border-border">
            <div className="flex items-start gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-xs font-semibold text-foreground">Legenda de Tipos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["String", "badge-string"],
                ["Integer", "badge-integer"],
                ["Double", "badge-double"],
                ["Boolean", "badge-boolean"],
                ["DateTime", "badge-datetime"],
                ["Object", "badge-object"],
                ["Array", "badge-array"],
                ["Long", "badge-long"],
                ["UUID", "badge-uuid"],
              ].map(([label, cls]) => (
                <span key={label} className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${cls}`}>
                  {label}
                </span>
              ))}
              <span className="text-[11px] text-muted-foreground ml-1">
                * = campo obrigatório
              </span>
            </div>
          </div>
        )}

        {/* API Tabs */}
        {!globalSearch.trim() && (
          <Tabs value={activeApi} onValueChange={setActiveApi}>
            <TabsList className="w-full h-auto bg-secondary/30 border border-border rounded-xl p-1 grid grid-cols-4 gap-1 mb-6">
              {apiData.map((api) => (
                <TabsTrigger
                  key={api.id}
                  value={api.id}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{api.icon}</span>
                    <ApiIcon apiId={api.id} />
                  </div>
                  <span className="font-medium leading-tight text-center hidden sm:block">
                    {api.id === "john-deere"
                      ? "John Deere"
                      : api.id === "trackunit"
                      ? "Trackunit IRIS"
                      : api.id === "hitachi"
                      ? "Hitachi AEMP"
                      : "Proemion"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {api.endpoints.length} endpoints
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {apiData.map((api) => (
              <TabsContent key={api.id} value={api.id} className="mt-0">
                <ApiPanel api={api} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-display font-semibold text-foreground">
                Mapeamento de APIs Agrícolas
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{apiData.length} APIs documentadas</span>
              <span>·</span>
              <span>{totalEndpoints} endpoints</span>
              <span>·</span>
              <span>{totalFields} campos mapeados</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3" />
              <span>Documento técnico — versão 2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
