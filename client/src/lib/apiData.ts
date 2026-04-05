// ============================================================
// Dados completos do mapeamento de APIs para monitoramento
// de máquinas agrícolas
// Design: Precision Agriculture Dashboard
// ============================================================

export interface ApiField {
  field: string;
  type: string;
  description: string;
  example: string;
  pragmaticUse: string;
  required?: boolean;
}

export interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "SOAP";
  path: string;
  description: string;
  oauthScope?: string;
  fields: ApiField[];
  jsonExample?: string;
  notes?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  baseUrl: string;
  authType: string;
  docUrl: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export const apiData: ApiCategory[] = [
  // ============================================================
  // 1. JOHN DEERE OPERATIONS CENTER API
  // ============================================================
  {
    id: "john-deere",
    name: "John Deere Operations Center API",
    color: "#166534",
    icon: "🚜",
    baseUrl: "https://sandboxapi.deere.com/platform",
    authType: "OAuth 2.0 (Authorization Code)",
    docUrl: "https://developer.deere.com/precision",
    description:
      "A John Deere Operations Center API oferece acesso a dados de máquinas telemáticas, incluindo equipamentos, alertas, horas de motor, localização e breadcrumbs com dados de sensores. Suporta frotas de máquinas agrícolas conectadas ao Operations Center.",
    endpoints: [
      {
        id: "jd-equipment",
        method: "GET",
        path: "/equipment",
        description:
          "Retorna informações detalhadas sobre os equipamentos registrados no Operations Center de uma organização. Inclui dados de identificação, classificação e categorização do ativo.",
        oauthScope: "eq1",
        fields: [
          { field: "id", type: "String", description: "Identificador único do equipamento", example: '"1234567890ABCDEF"', pragmaticUse: "Referência primária para chamadas subsequentes à API", required: true },
          { field: "name", type: "String", description: "Nome do equipamento", example: '"Trator JD 8R 370"', pragmaticUse: "Exibição na interface do utilizador para identificação rápida" },
          { field: "type", type: "String", description: "Tipo geral do equipamento", example: '"Tractor"', pragmaticUse: "Filtragem e categorização de equipamentos por tipo" },
          { field: "model", type: "String", description: "Modelo específico do equipamento", example: '"8R 370"', pragmaticUse: "Detalhes técnicos e verificação de compatibilidade" },
          { field: "brand", type: "String", description: "Marca do equipamento", example: '"John Deere"', pragmaticUse: "Identificação do fabricante e agrupamento por marca" },
          { field: "serialNumber", type: "String", description: "Número de série do equipamento", example: '"1RW8R370XXXXXXX"', pragmaticUse: "Rastreamento de garantia, manutenção e inventário" },
          { field: "category", type: "String", description: "Categoria do equipamento (legacy)", example: '"Tractor"', pragmaticUse: "Agrupamento de equipamentos por função — campo legado" },
          { field: "assetCategory", type: "String", description: "Categoria do ativo para gestão de frota", example: '"Tractor"', pragmaticUse: "Classificação de ativos para relatórios de frota" },
          { field: "assetType", type: "String", description: "Tipo de ativo com suporte amplo entre indústrias", example: '"Wheel Tractor"', pragmaticUse: "Sub-categorização de ativos — campo recomendado" },
          { field: "assetSubtype", type: "String", description: "Subtipo de ativo para detalhamento adicional", example: '"Large Row Crop"', pragmaticUse: "Detalhamento adicional do tipo de ativo para análises específicas" },
          { field: "equipmentApexType", type: "String", description: "Tipo específico para equipamentos agrícolas (GreenStar)", example: '"Tractor"', pragmaticUse: "Obrigatório para displays GreenStar — apenas agricultura" },
          { field: "links", type: "Array", description: "Links HATEOAS para recursos relacionados", example: '[{"@type":"Link","rel":"self","uri":"..."}]', pragmaticUse: "Navegação entre recursos da API (máquina, alertas, horas)" },
        ],
        jsonExample: `{
  "id": "1234567890ABCDEF",
  "name": "Trator JD 8R 370",
  "type": "Tractor",
  "model": "8R 370",
  "brand": "John Deere",
  "serialNumber": "1RW8R370XXXXXXX",
  "category": "Tractor",
  "assetCategory": "Tractor",
  "assetType": "Wheel Tractor",
  "assetSubtype": "Large Row Crop",
  "equipmentApexType": "Tractor",
  "links": [
    {"@type": "Link", "rel": "self", "uri": "/equipment/1234567890ABCDEF"},
    {"@type": "Link", "rel": "machines", "uri": "/machines/1234567890ABCDEF"}
  ]
}`,
        notes: "O campo assetType é recomendado em detrimento de category, que está marcado para depreciação futura.",
      },
      {
        id: "jd-alerts",
        method: "GET",
        path: "/machines/{principalId}/alerts",
        description:
          "Retorna alertas gerados pelas máquinas capturados no terminal. Inclui alertas de diagnóstico (DTC), geofencing e manutenção. A severidade é classificada por cor: RED (alta), YELLOW (média), GRAY (baixa/DTC), BLUE (informativo).",
        oauthScope: "eq1",
        fields: [
          { field: "@type", type: "String", description: "Tipo do alerta", example: '"DiagnosticTroubleCodeAlert"', pragmaticUse: "Classificação e priorização de alertas por tipo" },
          { field: "alertColor", type: "String", description: "Cor do alerta indicando severidade", example: '"RED"', pragmaticUse: "Priorização visual: RED=Alta, YELLOW=Média, GRAY=Baixa/DTC, BLUE=Info" },
          { field: "alertSeverity", type: "String", description: "Severidade textual do alerta", example: '"HIGH"', pragmaticUse: "Filtragem de alertas críticos para notificações imediatas" },
          { field: "duration.valueAsInteger", type: "String", description: "Valor inteiro da duração do alerta", example: '"3"', pragmaticUse: "Cálculo do tempo de persistência do problema" },
          { field: "duration.unit", type: "String", description: "Unidade de medida da duração", example: '"Seconds"', pragmaticUse: "Interpretação correta da duração do alerta" },
          { field: "occurrences", type: "String", description: "Número de ocorrências do alerta", example: '"1"', pragmaticUse: "Identificação de problemas recorrentes vs. isolados" },
          { field: "engineHours.reading.valueAsDouble", type: "Double", description: "Horas de motor no momento do alerta", example: "668.25", pragmaticUse: "Contexto operacional — correlação alerta vs. uso acumulado" },
          { field: "engineHours.reading.unit", type: "String", description: "Unidade das horas de motor", example: '"Hours"', pragmaticUse: "Interpretação correta do horímetro" },
          { field: "machineLinearTime", type: "Long", description: "Tempo linear da máquina para sincronização de eventos", example: "36951157", pragmaticUse: "Sincronização cronológica de eventos da máquina" },
          { field: "bus", type: "String", description: "Barramento de comunicação do alerta", example: '"0"', pragmaticUse: "Diagnóstico de problemas de comunicação CAN bus" },
          { field: "definition.suspectParameterName", type: "String", description: "Nome do parâmetro suspeito (SPN)", example: '"524019"', pragmaticUse: "Identificação do componente com problema via código SPN" },
          { field: "definition.failureModeIndicator", type: "String", description: "Indicador do modo de falha (FMI)", example: '"31"', pragmaticUse: "Detalhamento do tipo de falha para diagnóstico técnico" },
          { field: "definition.sourceAddress", type: "String", description: "Endereço da fonte do alerta (SA)", example: '"0"', pragmaticUse: "Rastreamento da origem do alerta no barramento CAN" },
          { field: "links", type: "Array", description: "Links para recursos relacionados (máquina, etc.)", example: '[{"rel":"machine","uri":"/machines/..."}]', pragmaticUse: "Navegação para detalhes da máquina que gerou o alerta" },
        ],
        jsonExample: `{
  "@type": "DiagnosticTroubleCodeAlert",
  "alertColor": "RED",
  "alertSeverity": "HIGH",
  "duration": {
    "valueAsInteger": "3",
    "unit": "Seconds"
  },
  "occurrences": "1",
  "engineHours": {
    "reading": {
      "valueAsDouble": 668.25,
      "unit": "Hours"
    }
  },
  "machineLinearTime": 36951157,
  "bus": "0",
  "definition": {
    "suspectParameterName": "524019",
    "failureModeIndicator": "31",
    "sourceAddress": "0"
  }
}`,
        notes: "Tipos de alerta disponíveis: DiagnosticTroubleCodeAlert, GeofenceAlert, MaintenanceAlert. Não suporta eTags.",
      },
      {
        id: "jd-device-state",
        method: "GET",
        path: "/machines/{principalId}/deviceStateReports",
        description:
          "Retorna o histórico de chamadas (call-in) do dispositivo telemático para um intervalo de datas. Cada relatório contém atributos sobre o estado do equipamento, terminal e conectividade.",
        oauthScope: "eq1",
        fields: [
          { field: "timestamp", type: "DateTime", description: "Data/hora do relatório de estado", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Rastreamento cronológico dos relatórios de estado" },
          { field: "deviceState", type: "String", description: "Estado atual do dispositivo telemático", example: '"ACTIVE"', pragmaticUse: "Monitoramento da conectividade do dispositivo" },
          { field: "terminalState", type: "String", description: "Estado do terminal de bordo", example: '"CONNECTED"', pragmaticUse: "Diagnóstico de problemas de comunicação com o terminal" },
          { field: "signalStrength", type: "Integer", description: "Força do sinal de comunicação", example: "85", pragmaticUse: "Avaliação da qualidade da conectividade em campo" },
          { field: "batteryVoltage", type: "Double", description: "Tensão da bateria do dispositivo", example: "12.6", pragmaticUse: "Monitoramento da saúde da bateria do dispositivo" },
          { field: "gpsLocked", type: "Boolean", description: "Indica se o GPS está com sinal fixo", example: "true", pragmaticUse: "Validação da precisão dos dados de localização" },
          { field: "links", type: "Array", description: "Links HATEOAS para recursos relacionados", example: '[{"rel":"machine","uri":"/machines/..."}]', pragmaticUse: "Navegação para a máquina associada ao relatório" },
        ],
        jsonExample: `{
  "timestamp": "2023-04-05T12:00:00Z",
  "deviceState": "ACTIVE",
  "terminalState": "CONNECTED",
  "signalStrength": 85,
  "batteryVoltage": 12.6,
  "gpsLocked": true,
  "links": [
    {"rel": "machine", "uri": "/machines/1234567890ABCDEF"}
  ]
}`,
        notes: "Fornece o histórico de call-in do dispositivo. Útil para auditar a conectividade e detectar períodos sem comunicação.",
      },
      {
        id: "jd-engine-hours",
        method: "GET",
        path: "/machines/{principalId}/engineHours",
        description:
          "Retorna o último valor reportado das horas de motor de uma máquina, incluindo o timestamp do relatório e a fonte dos dados.",
        oauthScope: "eq1",
        fields: [
          { field: "value", type: "Double", description: "Total de horas de motor acumuladas", example: "1234.5", pragmaticUse: "Cálculo de intervalos de manutenção preventiva" },
          { field: "unit", type: "String", description: "Unidade de medida das horas", example: '"Hours"', pragmaticUse: "Interpretação correta do valor retornado" },
          { field: "timestamp", type: "DateTime", description: "Data/hora da última leitura do horímetro", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Validação da atualidade dos dados de horas" },
          { field: "source", type: "String", description: "Fonte dos dados de horas de motor", example: '"MACHINE"', pragmaticUse: "Identificação da origem dos dados (máquina vs. manual)" },
          { field: "links", type: "Array", description: "Links para recursos relacionados", example: '[{"rel":"machine","uri":"/machines/..."}]', pragmaticUse: "Navegação para detalhes da máquina" },
        ],
        jsonExample: `{
  "value": 1234.5,
  "unit": "Hours",
  "timestamp": "2023-04-05T12:00:00Z",
  "source": "MACHINE",
  "links": [
    {"rel": "machine", "uri": "/machines/1234567890ABCDEF"}
  ]
}`,
      },
      {
        id: "jd-hours-operation",
        method: "GET",
        path: "/machines/{principalId}/hoursOfOperation",
        description:
          "Retorna as durações em que o motor esteve ligado ou desligado durante um intervalo de tempo especificado. Também fornece o último estado conhecido do motor.",
        oauthScope: "eq1",
        fields: [
          { field: "startDate", type: "DateTime", description: "Data/hora de início do período de registro", example: '"2013-04-29T00:00:00Z"', pragmaticUse: "Definição do intervalo de tempo para análise de utilização" },
          { field: "endDate", type: "DateTime", description: "Data/hora de término do período de registro", example: '"2013-04-30T00:00:00Z"', pragmaticUse: "Definição do intervalo de tempo para análise de utilização" },
          { field: "engineState", type: "Integer", description: "Estado do motor: 0 = desligado, 1 = ligado", example: "1", pragmaticUse: "Monitoramento do status de funcionamento do motor" },
          { field: "detailedState", type: "String", description: "Descrição detalhada do estado do motor", example: '"PTO Status On"', pragmaticUse: "Informações adicionais sobre o estado operacional (PTO, etc.)" },
          { field: "duration.valueAsDouble", type: "Double", description: "Duração do estado em horas", example: "8.5", pragmaticUse: "Cálculo do tempo efetivo de trabalho vs. tempo de inatividade" },
          { field: "duration.unit", type: "String", description: "Unidade da duração", example: '"Hours"', pragmaticUse: "Interpretação correta da duração" },
        ],
        jsonExample: `{
  "startDate": "2013-04-29T00:00:00Z",
  "endDate": "2013-04-30T00:00:00Z",
  "engineState": 1,
  "detailedState": "PTO Status On",
  "duration": {
    "valueAsDouble": 8.5,
    "unit": "Hours"
  }
}`,
      },
      {
        id: "jd-location-history",
        method: "GET",
        path: "/machines/{principalId}/locationHistory",
        description:
          "Retorna o histórico de localização de uma máquina para um intervalo de tempo especificado. Cada relatório inclui latitude, longitude e altitude.",
        oauthScope: "eq1",
        fields: [
          { field: "point.lat", type: "Double", description: "Latitude da posição da máquina", example: "41.597164", pragmaticUse: "Posicionamento vertical no mapa para exibição de rota" },
          { field: "point.lon", type: "Double", description: "Longitude da posição da máquina", example: "-90.54383", pragmaticUse: "Posicionamento horizontal no mapa para exibição de rota" },
          { field: "point.altitude.valueAsDouble", type: "Double", description: "Altitude em metros", example: "0.0", pragmaticUse: "Análise de terreno e perfil de elevação do percurso" },
          { field: "point.altitude.unit", type: "String", description: "Unidade da altitude", example: '"meters"', pragmaticUse: "Interpretação correta do valor de altitude" },
          { field: "eventTimestamp", type: "DateTime", description: "Data/hora do evento de localização", example: '"2010-10-20T22:32:16.000Z"', pragmaticUse: "Rastreamento cronológico da movimentação da máquina" },
          { field: "gpsFixTimestamp", type: "DateTime", description: "Data/hora da correção GPS", example: '"1970-01-01T00:00:00.000Z"', pragmaticUse: "Validação da precisão e atualidade do sinal GPS" },
        ],
        jsonExample: `{
  "point": {
    "lat": 41.597164,
    "lon": -90.54383,
    "altitude": {
      "valueAsDouble": 0.0,
      "unit": "meters"
    }
  },
  "eventTimestamp": "2010-10-20T22:32:16.000Z",
  "gpsFixTimestamp": "1970-01-01T00:00:00.000Z"
}`,
        notes: "Não suporta eTags. Use os parâmetros startDate e endDate para filtrar o intervalo de tempo.",
      },
      {
        id: "jd-breadcrumbs",
        method: "GET",
        path: "/machines/{principalId}/breadcrumbs",
        description:
          "Retorna dados detalhados de localização e sensores da máquina para um intervalo de tempo. Inclui velocidade, nível de combustível, direção, estado da máquina e dados de correlação.",
        oauthScope: "eq1",
        fields: [
          { field: "speed.valueAsDouble", type: "Double", description: "Velocidade da máquina", example: "15.5", pragmaticUse: "Monitoramento da velocidade operacional e detecção de excesso" },
          { field: "speed.unit", type: "String", description: "Unidade de velocidade", example: '"km/h"', pragmaticUse: "Interpretação correta do valor de velocidade" },
          { field: "fuelLevel.valueAsDouble", type: "Double", description: "Nível de combustível em percentual", example: "75.0", pragmaticUse: "Alertas de baixo combustível e planejamento de abastecimento" },
          { field: "fuelLevel.unit", type: "String", description: "Unidade do nível de combustível", example: '"percent"', pragmaticUse: "Interpretação correta do nível de combustível" },
          { field: "heading", type: "Integer", description: "Direção da máquina em graus (0-360)", example: "270", pragmaticUse: "Orientação da máquina no mapa e análise de padrões de trabalho" },
          { field: "machineState", type: "String", description: "Estado operacional da máquina", example: '"WORKING"', pragmaticUse: "Monitoramento do estado atual: WORKING, IDLE, TRANSPORT, OFF" },
          { field: "machineStateDefinedTypeId", type: "String", description: "ID do tipo de estado definido", example: '"1"', pragmaticUse: "Mapeamento para estados personalizados da aplicação" },
          { field: "correlationId", type: "String", description: "ID de correlação para rastreamento de eventos", example: '"abc123-def456"', pragmaticUse: "Correlação de breadcrumbs com outros eventos da máquina" },
          { field: "location.lat", type: "Double", description: "Latitude da posição", example: "41.597164", pragmaticUse: "Exibição em mapa em tempo real" },
          { field: "location.lon", type: "Double", description: "Longitude da posição", example: "-90.54383", pragmaticUse: "Exibição em mapa em tempo real" },
          { field: "location.altitude.valueAsDouble", type: "Double", description: "Altitude em metros", example: "150.0", pragmaticUse: "Análise de terreno e perfil de elevação" },
          { field: "origin", type: "String", description: "Origem dos dados do breadcrumb", example: '"GPS"', pragmaticUse: "Validação da fonte dos dados de localização" },
          { field: "createdTimestamp", type: "DateTime", description: "Data/hora de criação do breadcrumb", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Ordenação cronológica e análise de histórico" },
        ],
        jsonExample: `{
  "speed": {"valueAsDouble": 15.5, "unit": "km/h"},
  "fuelLevel": {"valueAsDouble": 75.0, "unit": "percent"},
  "heading": 270,
  "machineState": "WORKING",
  "machineStateDefinedTypeId": "1",
  "correlationId": "abc123-def456",
  "location": {
    "lat": 41.597164,
    "lon": -90.54383,
    "altitude": {"valueAsDouble": 150.0, "unit": "meters"}
  },
  "origin": "GPS",
  "createdTimestamp": "2023-04-05T12:00:00Z"
}`,
        notes: "Endpoint mais rico em dados de sensores. Combina localização com estado operacional e dados de combustível.",
      },
      {
        id: "jd-organizations",
        method: "GET",
        path: "/organizations",
        description:
          "Retorna as organizações associadas ao utilizador autenticado. Ponto de partida para navegar pela hierarquia de dados da API.",
        oauthScope: "org1",
        fields: [
          { field: "id", type: "String", description: "Identificador único da organização", example: '"123456"', pragmaticUse: "Referência para filtrar equipamentos e dados por organização" },
          { field: "name", type: "String", description: "Nome da organização", example: '"Fazenda São João"', pragmaticUse: "Exibição na interface para seleção de organização" },
          { field: "type", type: "String", description: "Tipo da organização", example: '"customer"', pragmaticUse: "Diferenciação entre clientes, revendedores e parceiros" },
          { field: "member", type: "Boolean", description: "Indica se o utilizador é membro", example: "true", pragmaticUse: "Controle de acesso e permissões" },
          { field: "links", type: "Array", description: "Links para recursos da organização", example: '[{"rel":"equipment","uri":"/organizations/123456/equipment"}]', pragmaticUse: "Navegação para equipamentos, campos e dados da organização" },
        ],
        jsonExample: `{
  "id": "123456",
  "name": "Fazenda São João",
  "type": "customer",
  "member": true,
  "links": [
    {"rel": "equipment", "uri": "/organizations/123456/equipment"},
    {"rel": "fields", "uri": "/organizations/123456/fields"},
    {"rel": "machines", "uri": "/organizations/123456/machines"}
  ]
}`,
      },
      {
        id: "jd-aemp",
        method: "GET",
        path: "/aemp/equipmentlist",
        description:
          "Endpoint AEMP 2.0 (ISO 15143-3) da John Deere. Retorna dados de máquinas no formato padrão ISO para integração com sistemas de terceiros e frotas mistas.",
        oauthScope: "eq1",
        fields: [
          { field: "EquipmentHeader.OEM", type: "String", description: "Fabricante do equipamento", example: '"John Deere"', pragmaticUse: "Filtragem por fabricante em frotas mistas" },
          { field: "EquipmentHeader.Model", type: "String", description: "Modelo do equipamento", example: '"8R 370"', pragmaticUse: "Detalhes do modelo para manutenção e compatibilidade" },
          { field: "EquipmentHeader.SerialNumber", type: "String", description: "Número de série", example: '"1RW8R370XXXXXXX"', pragmaticUse: "Rastreamento único do ativo" },
          { field: "Location.Latitude", type: "Double", description: "Latitude atual", example: "41.597164", pragmaticUse: "Posicionamento geográfico em mapa" },
          { field: "Location.Longitude", type: "Double", description: "Longitude atual", example: "-90.54383", pragmaticUse: "Posicionamento geográfico em mapa" },
          { field: "CumulativeOperatingHours.Hour", type: "Double", description: "Horas de operação acumuladas", example: "1234.5", pragmaticUse: "Cálculo de manutenção preventiva baseada em horas" },
          { field: "FuelUsed.FuelConsumed", type: "Double", description: "Combustível total consumido", example: "1500.0", pragmaticUse: "Cálculo de custo operacional e emissões" },
          { field: "FuelRemaining.Percent", type: "Double", description: "Percentual de combustível restante", example: "75.5", pragmaticUse: "Alerta de baixo nível e planejamento de abastecimento" },
          { field: "Distance.Odometer", type: "Double", description: "Leitura do hodômetro em km", example: "12345.6", pragmaticUse: "Manutenção baseada em distância e controle de depreciação" },
        ],
        jsonExample: `{
  "EquipmentHeader": {
    "OEM": "John Deere",
    "Model": "8R 370",
    "SerialNumber": "1RW8R370XXXXXXX",
    "EquipmentID": "EQP-001"
  },
  "Location": {
    "Latitude": 41.597164,
    "Longitude": -90.54383,
    "Altitude": 150.0,
    "Timestamp": "2023-04-05T12:00:00Z"
  },
  "CumulativeOperatingHours": {"Hour": 1234.5, "Timestamp": "2023-04-05T12:00:00Z"},
  "FuelUsed": {"FuelUnits": "Liters", "FuelConsumed": 1500.0},
  "FuelRemaining": {"Percent": 75.5, "Timestamp": "2023-04-05T12:00:00Z"},
  "Distance": {"Odometer": 12345.6, "Timestamp": "2023-04-05T12:00:00Z"}
}`,
        notes: "Endpoint padrão ISO 15143-3 para integração com sistemas de terceiros. Requer configuração prévia de credenciais AEMP.",
      },
    ],
  },

  // ============================================================
  // 2. TRACKUNIT IRIS API
  // ============================================================
  {
    id: "trackunit",
    name: "Trackunit IRIS API",
    color: "#1d4ed8",
    icon: "📡",
    baseUrl: "https://iris.trackunit.com/api",
    authType: "Bearer Token (API Token v2)",
    docUrl: "https://developers.trackunit.com/reference/iris-api-overview",
    description:
      "A Trackunit IRIS API oferece uma suíte completa de serviços REST e GraphQL para gestão de ativos, telemetria de dispositivos, localização, falhas CAN, emissões e muito mais. Suporta frotas mistas com padrão AEMP 2.0.",
    endpoints: [
      {
        id: "tu-get-assets",
        method: "GET",
        path: "/asset/v1/assets",
        description:
          "Retorna uma lista paginada de ativos com detalhes completos. Resultados ordenados por data de criação em modo ascendente.",
        fields: [
          { field: "id", type: "UUID", description: "Identificador único do ativo", example: '"a1b2c3d4-e5f6-7890-1234-567890abcdef"', pragmaticUse: "Referência primária para operações sobre o ativo", required: true },
          { field: "name", type: "String", description: "Nome do ativo", example: '"Escavadeira CAT 320D"', pragmaticUse: "Exibição na lista de ativos da interface", required: true },
          { field: "assetType", type: "String", description: "Tipo do ativo: MACHINE, ATTACHMENT, EQUIPMENT, TOOL, OTHER, GATEWAY", example: '"MACHINE"', pragmaticUse: "Classificação e filtragem por tipo de ativo", required: true },
          { field: "brand", type: "String", description: "Marca do ativo", example: '"Caterpillar"', pragmaticUse: "Identificação do fabricante e agrupamento por marca" },
          { field: "model", type: "String", description: "Modelo do ativo", example: '"320D"', pragmaticUse: "Detalhes específicos do modelo para manutenção" },
          { field: "serialNumber", type: "String", description: "Número de série (VIN, PIN, etc.)", example: '"CAT320DXXXXXXX"', pragmaticUse: "Rastreamento único e inventário do ativo" },
          { field: "createdAt", type: "DateTime", description: "Timestamp de criação do ativo na plataforma", example: '"2023-01-15T10:30:00Z"', pragmaticUse: "Auditoria e histórico de onboarding de ativos", required: true },
          { field: "externalReference", type: "String", description: "Referência externa (ex: ID de ERP)", example: '"ERP-ASSET-001"', pragmaticUse: "Integração com sistemas ERP e identificadores externos" },
          { field: "hidden", type: "Boolean", description: "Indica se o ativo está oculto na plataforma", example: "false", pragmaticUse: "Controle de visibilidade na aplicação" },
          { field: "ownerAccountId", type: "UUID", description: "ID da conta proprietária do ativo", example: '"f1e2d3c4-b5a6-7890-1234-567890abcdef"', pragmaticUse: "Gestão de propriedade e controle de acesso", required: true },
          { field: "productionDate", type: "Date", description: "Data de produção do ativo", example: '"2022-05-20"', pragmaticUse: "Cálculo de idade do ativo e planejamento de substituição" },
          { field: "productionYear", type: "Integer", description: "Ano de produção do ativo", example: "2022", pragmaticUse: "Filtragem por ano de fabricação e análise de frota" },
          { field: "type", type: "String", description: "Tipo específico do ativo (escavadeira, elevador, etc.)", example: '"excavator"', pragmaticUse: "Categorização detalhada para relatórios operacionais" },
          { field: "number", type: "Integer", description: "Número da página atual (paginação)", example: "0", pragmaticUse: "Controle de paginação na listagem de ativos" },
          { field: "totalElements", type: "Long", description: "Total de elementos disponíveis", example: "150", pragmaticUse: "Exibição do total de ativos na frota" },
          { field: "telematicsDevices", type: "Array", description: "Lista de dispositivos telemáticos associados", example: '[{"id":"...","serialNumber":"TU-DEVICE-XXXXX"}]', pragmaticUse: "Acesso a dados de telemetria do dispositivo" },
          { field: "telematicsDevices[].id", type: "UUID", description: "ID do dispositivo telemático", example: '"g1h2i3j4-k5l6-7890-1234-567890abcdef"', pragmaticUse: "Identificação do dispositivo para chamadas de telemetria" },
          { field: "telematicsDevices[].serialNumber", type: "String", description: "Número de série do dispositivo telemático", example: '"TU-DEVICE-XXXXX"', pragmaticUse: "Rastreamento físico do hardware de telemetria" },
        ],
        jsonExample: `{
  "content": [{
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "Escavadeira CAT 320D",
    "assetType": "MACHINE",
    "brand": "Caterpillar",
    "model": "320D",
    "serialNumber": "CAT320DXXXXXXX",
    "createdAt": "2023-01-15T10:30:00Z",
    "externalReference": "ERP-ASSET-001",
    "hidden": false,
    "ownerAccountId": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
    "productionDate": "2022-05-20",
    "productionYear": 2022,
    "type": "excavator",
    "telematicsDevices": [
      {"id": "g1h2i3j4-k5l6-7890-1234-567890abcdef", "serialNumber": "TU-DEVICE-XXXXX"}
    ]
  }],
  "totalElements": 150,
  "totalPages": 8,
  "size": 20,
  "number": 0
}`,
      },
      {
        id: "tu-device-telemetry",
        method: "GET",
        path: "/telematics-device/v2/devices/{id}/telemetry",
        description:
          "Retorna dados de telemetria em tempo real do dispositivo: energia, conectividade (GPS, GSM, Wi-Fi, Bluetooth), entradas/saídas digitais e sensores externos.",
        fields: [
          { field: "id", type: "UUID", description: "ID único do dispositivo telemático", example: '"97ceb48e-9fa8-41e2-880d-39aa2e7cfd10"', pragmaticUse: "Identificação do dispositivo na resposta" },
          { field: "connectivity.gps.satellites", type: "Integer", description: "Número de satélites GPS visíveis", example: "20", pragmaticUse: "Avaliação da qualidade do sinal GPS" },
          { field: "connectivity.gps.signalQuality", type: "Integer", description: "Qualidade do sinal GPS (0-100)", example: "32", pragmaticUse: "Monitoramento da precisão da localização" },
          { field: "connectivity.gps.latestFixTime", type: "DateTime", description: "Última correção GPS bem-sucedida", example: '"2026-01-14T09:46:06Z"', pragmaticUse: "Validação da atualidade dos dados de localização" },
          { field: "connectivity.gsm.signalQuality", type: "Integer", description: "Qualidade do sinal GSM (0-31)", example: "4", pragmaticUse: "Diagnóstico de problemas de conectividade celular" },
          { field: "connectivity.gsm.networkTechnology", type: "String", description: "Tecnologia de rede celular", example: '"NW_TECH_4G"', pragmaticUse: "Identificação da geração de rede (2G/3G/4G/5G)" },
          { field: "connectivity.transmissions.latestReceptionTime", type: "DateTime", description: "Última transmissão recebida", example: '"2026-01-14T09:46:08.4Z"', pragmaticUse: "Monitoramento da frequência de transmissão de dados" },
          { field: "connectivity.wifi.connected", type: "Boolean", description: "Status de conexão Wi-Fi", example: "true", pragmaticUse: "Verificação de conectividade Wi-Fi para transferência de dados" },
          { field: "connectivity.wifi.ssid", type: "String", description: "Nome da rede Wi-Fi conectada", example: '"FazendaWiFi"', pragmaticUse: "Identificação da rede de conectividade" },
          { field: "connectivity.wifi.rssi", type: "Integer", description: "Força do sinal Wi-Fi (RSSI)", example: "60", pragmaticUse: "Avaliação da qualidade da conexão Wi-Fi" },
          { field: "connectivity.wifi.securityType", type: "String", description: "Tipo de segurança Wi-Fi", example: '"WPA2_PSK"', pragmaticUse: "Verificação de conformidade de segurança da rede" },
          { field: "connectivity.bluetooth.connected", type: "Boolean", description: "Status de conexão Bluetooth (KIN/KIN2)", example: "false", pragmaticUse: "Verificação de conectividade Bluetooth (apenas KIN, KIN2)" },
          { field: "power.external.voltage", type: "Double", description: "Tensão da fonte de alimentação externa", example: "12.6", pragmaticUse: "Monitoramento da saúde da bateria do veículo" },
          { field: "power.external.connected", type: "Boolean", description: "Indica se a alimentação externa está conectada", example: "true", pragmaticUse: "Detecção de desconexão de bateria (possível furto)" },
          { field: "power.internal.batteryLevel", type: "Integer", description: "Nível da bateria interna do dispositivo (%)", example: "85", pragmaticUse: "Monitoramento da bateria backup do dispositivo" },
          { field: "io.input1.state", type: "Boolean", description: "Estado da entrada digital 1", example: "true", pragmaticUse: "Monitoramento de ignição, PTO ou sensor externo" },
          { field: "io.input2.state", type: "Boolean", description: "Estado da entrada digital 2", example: "false", pragmaticUse: "Monitoramento de sensor ou atuador externo" },
          { field: "io.output1.state", type: "Boolean", description: "Estado da saída digital 1", example: "false", pragmaticUse: "Controle remoto de equipamentos (imobilizador, etc.)" },
          { field: "canBus.can1.status", type: "String", description: "Status do barramento CAN 1", example: '"ACTIVE"', pragmaticUse: "Diagnóstico de comunicação CAN bus" },
          { field: "sensor.temperature1.value", type: "Double", description: "Leitura do sensor de temperatura 1", example: "25.3", pragmaticUse: "Monitoramento de temperatura ambiente ou de fluidos" },
          { field: "sensor.distance.value", type: "Double", description: "Leitura do sensor de distância", example: "1500.5", pragmaticUse: "Monitoramento de distância percorrida" },
        ],
        jsonExample: `{
  "id": "97ceb48e-9fa8-41e2-880d-39aa2e7cfd10",
  "connectivity": {
    "gps": {"satellites": 20, "signalQuality": 32, "latestFixTime": "2026-01-14T09:46:06Z"},
    "gsm": {"signalQuality": 4, "networkTechnology": "NW_TECH_4G"},
    "transmissions": {"latestReceptionTime": "2026-01-14T09:46:08.4Z"},
    "wifi": {"connected": true, "ssid": "FazendaWiFi", "rssi": 60, "securityType": "WPA2_PSK"}
  },
  "power": {
    "external": {"voltage": 12.6, "connected": true},
    "internal": {"batteryLevel": 85}
  },
  "io": {
    "input1": {"state": true},
    "input2": {"state": false},
    "output1": {"state": false}
  },
  "sensor": {
    "temperature1": {"value": 25.3, "unit": "Celsius"},
    "distance": {"value": 1500.5, "unit": "km"}
  }
}`,
        notes: "Bluetooth disponível apenas para dispositivos KIN, KIN2 e BLUETOOTH_TAG. Entradas 5-6 apenas para TU700.",
      },
      {
        id: "tu-locations",
        method: "GET",
        path: "/location/v1/locations",
        description:
          "Retorna uma lista paginada de localizações de ativos em formato GeoJSON. A geometria é sempre do tipo Point com longitude e latitude.",
        fields: [
          { field: "id", type: "UUID", description: "ID da localização", example: '"loc-uuid-1234"', pragmaticUse: "Referência única para a leitura de localização" },
          { field: "type", type: "String", description: "Tipo GeoJSON (sempre 'Feature')", example: '"Feature"', pragmaticUse: "Conformidade com o padrão GeoJSON para mapas" },
          { field: "geometry.type", type: "String", description: "Tipo de geometria GeoJSON (sempre 'Point')", example: '"Point"', pragmaticUse: "Identificação do formato de coordenadas" },
          { field: "geometry.coordinates[0]", type: "Double", description: "Longitude do ponto (GeoJSON: lon primeiro)", example: "-90.54383", pragmaticUse: "Posicionamento horizontal no mapa" },
          { field: "geometry.coordinates[1]", type: "Double", description: "Latitude do ponto", example: "41.597164", pragmaticUse: "Posicionamento vertical no mapa" },
          { field: "geometry.coordinates[2]", type: "Double", description: "Altitude em metros (quando disponível)", example: "150.2", pragmaticUse: "Análise de elevação do terreno" },
          { field: "properties.assetId", type: "UUID", description: "ID do ativo associado à localização", example: '"a1b2c3d4-e5f6-7890-1234-567890abcdef"', pragmaticUse: "Associação da localização ao ativo correto" },
          { field: "properties.timestamp", type: "DateTime", description: "Data/hora da leitura de localização", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Rastreamento do histórico de localização" },
          { field: "properties.speed", type: "Double", description: "Velocidade do ativo em km/h", example: "30.5", pragmaticUse: "Monitoramento de velocidade operacional" },
          { field: "properties.heading", type: "Integer", description: "Direção em graus (0-360)", example: "90", pragmaticUse: "Orientação do ativo no mapa" },
          { field: "properties.altitude", type: "Double", description: "Altitude em metros", example: "150.2", pragmaticUse: "Informação de elevação para análise de terreno" },
        ],
        jsonExample: `{
  "content": [{
    "id": "loc-uuid-1234",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-90.54383, 41.597164, 150.2]
    },
    "properties": {
      "assetId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "timestamp": "2023-04-05T12:00:00Z",
      "speed": 30.5,
      "heading": 90,
      "altitude": 150.2
    }
  }],
  "totalElements": 500,
  "totalPages": 25
}`,
        notes: "Formato GeoJSON padrão. Altitude não disponível para ativos Bluetooth tag. Taxa limite: 1 req/s por página/utilizador.",
      },
      {
        id: "tu-can-faults",
        method: "POST",
        path: "/can-faults/v1/faults",
        description:
          "Retorna falhas CAN bus por IDs de máquina e intervalo de datas. Permite filtrar por SPN (Suspect Parameter Name), FMI (Failure Mode Indicator) e SA (Source Address).",
        fields: [
          { field: "machineId", type: "UUID", description: "ID da máquina com falha", example: '"a1b2c3d4-e5f6-7890-1234-567890abcdef"', pragmaticUse: "Associação da falha à máquina correta" },
          { field: "timestamp", type: "DateTime", description: "Data/hora da ocorrência da falha", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Rastreamento cronológico de falhas" },
          { field: "spn", type: "Integer", description: "Suspect Parameter Number — identifica o componente", example: "524019", pragmaticUse: "Identificação do componente com problema via código SPN" },
          { field: "fmi", type: "Integer", description: "Failure Mode Indicator — tipo de falha", example: "31", pragmaticUse: "Diagnóstico do tipo de falha: 0=Alta, 1=Baixa, 2=Errático, etc." },
          { field: "sa", type: "Integer", description: "Source Address — endereço da ECU de origem", example: "0", pragmaticUse: "Identificação da ECU que reportou a falha" },
          { field: "occurrenceCount", type: "Integer", description: "Número de ocorrências da falha", example: "3", pragmaticUse: "Avaliação da frequência e gravidade do problema" },
          { field: "activeDuration", type: "Integer", description: "Duração ativa da falha em segundos", example: "120", pragmaticUse: "Análise da persistência do problema" },
          { field: "description", type: "String", description: "Descrição textual da falha", example: '"Engine Oil Pressure Low"', pragmaticUse: "Exibição amigável da falha para operadores" },
          { field: "severity", type: "String", description: "Severidade da falha", example: '"HIGH"', pragmaticUse: "Priorização de manutenção corretiva" },
        ],
        jsonExample: `{
  "faults": [{
    "machineId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "timestamp": "2023-04-05T12:00:00Z",
    "spn": 524019,
    "fmi": 31,
    "sa": 0,
    "occurrenceCount": 3,
    "activeDuration": 120,
    "description": "Engine Oil Pressure Low",
    "severity": "HIGH"
  }]
}`,
        notes: "Requer no body: machineIds (array), startDate, endDate. Filtros opcionais: spn, fmi, sa.",
      },
      {
        id: "tu-machine-extended",
        method: "GET",
        path: "/public/api/machine/machines/{machineId}/extended-information",
        description:
          "Retorna informações estendidas e específicas do fabricante/modelo para uma máquina. Os campos variam conforme o tipo de máquina e o OEM.",
        fields: [
          { field: "_links", type: "Object", description: "Links HATEOAS para navegação entre recursos", example: '{"self":{"href":"/machines/..."}}', pragmaticUse: "Navegação entre recursos relacionados da API" },
          { field: "extendedInformation", type: "Object", description: "Objeto com informações estendidas específicas do fabricante", example: '{"engineHours":1234.5,"fuelLevel":75}', pragmaticUse: "Acesso a dados proprietários do OEM não disponíveis no padrão" },
          { field: "extendedInformation.<campo_dinâmico>", type: "Variável", description: "Campos específicos do fabricante e modelo", example: '"Valor Exemplo"', pragmaticUse: "Personalização da exibição de dados proprietários do OEM" },
        ],
        jsonExample: `{
  "_links": {
    "self": {"href": "/machines/a1b2c3d4/extended-information"}
  },
  "extendedInformation": {
    "engineHours": 1234.5,
    "fuelLevel": 75,
    "defLevel": 60,
    "hydraulicOilTemp": 85,
    "coolantTemp": 90
  }
}`,
        notes: "Os campos retornados variam por fabricante e modelo. Consulte a documentação específica do OEM para os campos disponíveis.",
      },
      {
        id: "tu-aemp-snapshot",
        method: "GET",
        path: "/aemp/v2/snapshot",
        description:
          "Exporta dados de máquinas no formato ISO 15143-3 (AEMP 2.0) — snapshot de dados atuais. Inclui todos os campos padrão do protocolo AEMP para integração com sistemas de terceiros.",
        fields: [
          { field: "EquipmentHeader.OEM", type: "String", description: "Fabricante do equipamento", example: '"Caterpillar"', pragmaticUse: "Filtragem por fabricante em frotas mistas" },
          { field: "EquipmentHeader.Model", type: "String", description: "Modelo do equipamento", example: '"320D"', pragmaticUse: "Detalhes do modelo para manutenção" },
          { field: "EquipmentHeader.SerialNumber", type: "String", description: "Número de série", example: '"CAT320DXXXXXXX"', pragmaticUse: "Rastreamento único do ativo" },
          { field: "CumulativeOperatingHours.Hour", type: "Double", description: "Horas de operação acumuladas", example: "2500.0", pragmaticUse: "Cálculo de intervalos de manutenção" },
          { field: "CumulativeIdleHours.Hour", type: "Double", description: "Horas de inatividade acumuladas", example: "150.0", pragmaticUse: "Análise de eficiência operacional" },
          { field: "FuelUsed.FuelConsumed", type: "Double", description: "Combustível total consumido (litros)", example: "3500.0", pragmaticUse: "Cálculo de custo operacional" },
          { field: "FuelRemaining.Percent", type: "Double", description: "Percentual de combustível restante", example: "65.0", pragmaticUse: "Alerta de baixo combustível" },
          { field: "DEFRemaining.Percent", type: "Double", description: "Percentual de DEF/AdBlue restante", example: "80.0", pragmaticUse: "Prevenção de derate por falta de DEF em motores Tier 4/Stage V" },
          { field: "Distance.Odometer", type: "Double", description: "Hodômetro em km", example: "15000.0", pragmaticUse: "Manutenção baseada em distância" },
          { field: "Location.Latitude", type: "Double", description: "Latitude atual", example: "-15.7801", pragmaticUse: "Posicionamento em mapa" },
          { field: "Location.Longitude", type: "Double", description: "Longitude atual", example: "-47.9292", pragmaticUse: "Posicionamento em mapa" },
        ],
        jsonExample: `{
  "EquipmentHeader": {
    "OEM": "Caterpillar",
    "Model": "320D",
    "SerialNumber": "CAT320DXXXXXXX",
    "EquipmentID": "TU-EQP-001"
  },
  "Location": {"Latitude": -15.7801, "Longitude": -47.9292, "Timestamp": "2023-04-05T12:00:00Z"},
  "CumulativeOperatingHours": {"Hour": 2500.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "CumulativeIdleHours": {"Hour": 150.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "FuelUsed": {"FuelUnits": "Liters", "FuelConsumed": 3500.0},
  "FuelRemaining": {"Percent": 65.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "DEFRemaining": {"Percent": 80.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "Distance": {"Odometer": 15000.0, "Timestamp": "2023-04-05T12:00:00Z"}
}`,
        notes: "DEFRemaining (AdBlue) é um campo AEMP 2.0 para motores Tier 4 Final e Stage V. Essencial para evitar derate automático.",
      },
      {
        id: "tu-alerts",
        method: "GET",
        path: "/alert/v1/alerts",
        description:
          "Retorna alertas configurados e ativos para os ativos da conta. Inclui alertas de geofence, manutenção, conectividade e falhas.",
        fields: [
          { field: "id", type: "UUID", description: "ID único do alerta", example: '"alert-uuid-1234"', pragmaticUse: "Referência para gestão e resolução de alertas" },
          { field: "assetId", type: "UUID", description: "ID do ativo associado ao alerta", example: '"a1b2c3d4-e5f6-7890-1234-567890abcdef"', pragmaticUse: "Associação do alerta ao ativo correto" },
          { field: "alertType", type: "String", description: "Tipo do alerta: GEOFENCE, MAINTENANCE, CONNECTIVITY, FAULT", example: '"MAINTENANCE"', pragmaticUse: "Classificação e roteamento de alertas por tipo" },
          { field: "severity", type: "String", description: "Severidade: CRITICAL, HIGH, MEDIUM, LOW, INFO", example: '"HIGH"', pragmaticUse: "Priorização de resposta a alertas" },
          { field: "message", type: "String", description: "Mensagem descritiva do alerta", example: '"Manutenção preventiva vencida: 500h"', pragmaticUse: "Exibição de notificação para operadores e gestores" },
          { field: "triggeredAt", type: "DateTime", description: "Data/hora em que o alerta foi acionado", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Rastreamento temporal de alertas" },
          { field: "resolvedAt", type: "DateTime", description: "Data/hora de resolução do alerta (null se ativo)", example: "null", pragmaticUse: "Monitoramento de alertas abertos vs. resolvidos" },
          { field: "status", type: "String", description: "Status do alerta: ACTIVE, RESOLVED, ACKNOWLEDGED", example: '"ACTIVE"', pragmaticUse: "Gestão do ciclo de vida dos alertas" },
        ],
        jsonExample: `{
  "alerts": [{
    "id": "alert-uuid-1234",
    "assetId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "alertType": "MAINTENANCE",
    "severity": "HIGH",
    "message": "Manutenção preventiva vencida: 500h",
    "triggeredAt": "2023-04-05T12:00:00Z",
    "resolvedAt": null,
    "status": "ACTIVE"
  }]
}`,
      },
    ],
  },

  // ============================================================
  // 3. HITACHI CONSTRUCTION MACHINERY API (AEMP 2.0 / ISO 15143-3)
  // ============================================================
  {
    id: "hitachi",
    name: "Hitachi Construction Machinery API",
    color: "#b45309",
    icon: "🏗️",
    baseUrl: "https://api.globalexservice.com",
    authType: "Basic Auth (username/password) ou OAuth 2.0",
    docUrl: "https://www.hitachicm.com/global/en/solutions/telematics-api/",
    description:
      "A Hitachi Construction Machinery API adere ao padrão AEMP 2.0 (ISO 15143-3), oferecendo dados telemáticos padronizados para máquinas de construção e mineração. Suporta tanto o padrão AEMP 1.2 quanto o ISO 15143-3 completo.",
    endpoints: [
      {
        id: "hitachi-equipment-list",
        method: "GET",
        path: "/telematics/v1/equipmentlist",
        description:
          "Retorna a lista completa de equipamentos registrados com dados básicos de identificação. Ponto de entrada para obter os IDs necessários para chamadas subsequentes.",
        fields: [
          { field: "EquipmentHeader.OEM", type: "String", description: "Fabricante do equipamento", example: '"Hitachi"', pragmaticUse: "Filtragem por fabricante em frotas mistas" },
          { field: "EquipmentHeader.Model", type: "String", description: "Modelo do equipamento", example: '"ZX210"', pragmaticUse: "Detalhes do modelo para manutenção e peças" },
          { field: "EquipmentHeader.SerialNumber", type: "String", description: "Número de série único", example: '"HCMZX210XXXXXXX"', pragmaticUse: "Rastreamento único e inventário" },
          { field: "EquipmentHeader.EquipmentID", type: "String", description: "ID interno do equipamento", example: '"EQP-001"', pragmaticUse: "Referência para chamadas de dados detalhados" },
          { field: "EquipmentHeader.PIN", type: "String", description: "Product Identification Number", example: '"HCMZX210XXXXXXX"', pragmaticUse: "Identificação padrão ISO do produto" },
        ],
        jsonExample: `{
  "EquipmentList": [{
    "EquipmentHeader": {
      "OEM": "Hitachi",
      "Model": "ZX210",
      "SerialNumber": "HCMZX210XXXXXXX",
      "EquipmentID": "EQP-001",
      "PIN": "HCMZX210XXXXXXX"
    }
  }]
}`,
      },
      {
        id: "hitachi-snapshot",
        method: "GET",
        path: "/telematics/v1/snapshot",
        description:
          "Retorna o snapshot atual de dados telemáticos de todos os equipamentos no formato ISO 15143-3 completo. Inclui localização, horas, combustível, DEF/AdBlue, distância e dados de carga.",
        fields: [
          { field: "EquipmentHeader.OEM", type: "String", description: "Fabricante do equipamento", example: '"Hitachi"', pragmaticUse: "Identificação do fabricante" },
          { field: "EquipmentHeader.Model", type: "String", description: "Modelo do equipamento", example: '"ZX210"', pragmaticUse: "Detalhes técnicos do modelo" },
          { field: "EquipmentHeader.SerialNumber", type: "String", description: "Número de série", example: '"HCMZX210XXXXXXX"', pragmaticUse: "Rastreamento único do ativo" },
          { field: "EquipmentHeader.UnitInstallDateTime", type: "DateTime", description: "[ISO 15143-3] Data de instalação da unidade telemática", example: '"2022-01-15T10:30:00Z"', pragmaticUse: "Cálculo de cobertura de dados históricos e validade do dispositivo" },
          { field: "Location.Latitude", type: "Double", description: "Latitude atual do equipamento", example: "34.5678", pragmaticUse: "Posicionamento geográfico em mapa" },
          { field: "Location.Longitude", type: "Double", description: "Longitude atual do equipamento", example: "-118.1234", pragmaticUse: "Posicionamento geográfico em mapa" },
          { field: "Location.Altitude", type: "Double", description: "Altitude em metros", example: "500.0", pragmaticUse: "Análise de terreno e elevação" },
          { field: "Location.Timestamp", type: "DateTime", description: "Data/hora da leitura de localização", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Validação da atualidade dos dados de posição" },
          { field: "EngineStatus.Running", type: "Boolean", description: "[ISO 15143-3] Motor ligado/desligado", example: "true", pragmaticUse: "Detecção de ciclos on/off e cálculo de horas reais vs. tempo conectado" },
          { field: "CumulativeOperatingHours.Hour", type: "Double", description: "Total de horas de operação acumuladas", example: "1234.5", pragmaticUse: "Cálculo de intervalos de manutenção preventiva" },
          { field: "CumulativeOperatingHours.Timestamp", type: "DateTime", description: "Data/hora da leitura de horas", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Registro da última atualização do horímetro" },
          { field: "CumulativeIdleHours.Hour", type: "Double", description: "Total de horas de inatividade acumuladas", example: "50.2", pragmaticUse: "Análise de eficiência — identificação de períodos ociosos" },
          { field: "CumulativeIdleHours.Timestamp", type: "DateTime", description: "Data/hora da leitura de horas ociosas", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Registro da última atualização de horas ociosas" },
          { field: "CumulativeIdleNonOperatingHours.Hour", type: "Double", description: "[ISO 15143-3] Horas com motor ligado mas sem carga (não operando)", example: "15.5", pragmaticUse: "Distinção entre idle (parado) e non-operating (motor ligado sem trabalho)" },
          { field: "CumulativeActiveRegenerationHours.Hour", type: "Double", description: "[ISO 15143-3] Horas de regeneração ativa do filtro de partículas (DPF)", example: "8.2", pragmaticUse: "Crítico para Tier 4/Stage V — regeneração excessiva indica problema no DPF" },
          { field: "CumulativePowerTakeOffHours.Hour", type: "Double", description: "[ISO 15143-3] Horas de operação do PTO (tomada de força)", example: "120.5", pragmaticUse: "Importante para máquinas com implementos hidráulicos ou elétricos auxiliares" },
          { field: "FuelUsed.FuelUnits", type: "String", description: "Unidade de medida do combustível", example: '"Liters"', pragmaticUse: "Interpretação correta do volume de combustível" },
          { field: "FuelUsed.FuelConsumed", type: "Double", description: "Volume total de combustível consumido", example: "1500.0", pragmaticUse: "Cálculo de custos operacionais e emissões de CO₂" },
          { field: "FuelUsedLast24.FuelConsumed", type: "Double", description: "[ISO 15143-3] Combustível consumido nas últimas 24 horas (janela deslizante)", example: "45.5", pragmaticUse: "Relatórios diários de consumo — útil para custos operacionais e análise de eficiência" },
          { field: "FuelRemaining.Percent", type: "Double", description: "Percentual de combustível restante no tanque", example: "75.5", pragmaticUse: "Alerta de baixo nível e planejamento de abastecimento em campo" },
          { field: "FuelRemaining.FuelTankCapacity", type: "Double", description: "[ISO 15143-3] Capacidade total do tanque de combustível em litros", example: "200.0", pragmaticUse: "Conversão de % em volume real e cálculo de autonomia" },
          { field: "FuelRemaining.Timestamp", type: "DateTime", description: "Data/hora da leitura de combustível", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Validação da atualidade dos dados de combustível" },
          { field: "DEFRemaining.Percent", type: "Double", description: "Percentual de DEF/AdBlue restante no tanque", example: "80.0", pragmaticUse: "Prevenção de derate automático em motores Tier 4 Final e Stage V" },
          { field: "DEFRemaining.DEFTankCapacity", type: "Double", description: "[ISO 15143-3] Capacidade total do tanque de DEF em litros", example: "50.0", pragmaticUse: "Conversão de % em volume real e cálculo de autonomia de DEF" },
          { field: "DEFRemaining.Timestamp", type: "DateTime", description: "Data/hora da leitura de DEF", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Monitoramento contínuo do nível de DEF para conformidade ambiental" },
          { field: "Distance.Odometer", type: "Double", description: "Leitura do hodômetro em km", example: "12345.6", pragmaticUse: "Manutenção baseada em distância e controle de depreciação" },
          { field: "Distance.Timestamp", type: "DateTime", description: "Data/hora da leitura do hodômetro", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Registro da última atualização do hodômetro" },
          { field: "CumulativePayloadTotal.Payload", type: "Double", description: "Carga total acumulada transportada (toneladas)", example: "5000.0", pragmaticUse: "Cálculo de produtividade: toneladas movidas por hora" },
          { field: "CumulativeLoadCount.LoadCount", type: "Integer", description: "Número total de ciclos de carga", example: "250", pragmaticUse: "Benchmarking de produção e análise de ciclos de trabalho" },
          { field: "MaxSpeed.Speed", type: "Double", description: "Velocidade máxima registrada no período", example: "35.0", pragmaticUse: "Controle de velocidade e conformidade com políticas de segurança" },
          { field: "MaximumSpeedLast24.Speed", type: "Double", description: "[ISO 15143-3] Velocidade máxima nas últimas 24 horas (janela deslizante)", example: "38.5", pragmaticUse: "Análise de comportamento de condução — diferente de MaxSpeed geral" },
          { field: "AverageLoadFactorLast24.LoadFactor", type: "Double", description: "[ISO 15143-3] Fator médio de carga do motor nas últimas 24h (%)", example: "72.3", pragmaticUse: "Análise de intensidade de trabalho — alta carga indica maior desgaste" },
          { field: "AverageFuelConsumption.FuelConsumed", type: "Double", description: "[Hitachi P-API Proprietário] Consumo médio de combustível (L/h)", example: "18.5", pragmaticUse: "Análise de eficiência de combustível e benchmarking" },
        ],
        jsonExample: `{
  "EquipmentHeader": {
    "OEM": "Hitachi",
    "Model": "ZX210",
    "SerialNumber": "HCMZX210XXXXXXX",
    "EquipmentID": "EQP-001"
  },
  "Location": {
    "Latitude": 34.5678, "Longitude": -118.1234,
    "Altitude": 500.0, "Timestamp": "2023-04-05T12:00:00Z"
  },
  "CumulativeOperatingHours": {"Hour": 1234.5, "Timestamp": "2023-04-05T12:00:00Z"},
  "CumulativeIdleHours": {"Hour": 50.2, "Timestamp": "2023-04-05T12:00:00Z"},
  "FuelUsed": {"FuelUnits": "Liters", "FuelConsumed": 1500.0},
  "FuelRemaining": {"Percent": 75.5, "Timestamp": "2023-04-05T12:00:00Z"},
  "DEFRemaining": {"Percent": 80.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "Distance": {"Odometer": 12345.6, "Timestamp": "2023-04-05T12:00:00Z"},
  "CumulativePayloadTotal": {"Payload": 5000.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "CumulativeLoadCount": {"LoadCount": 250, "Timestamp": "2023-04-05T12:00:00Z"},
  "MaxSpeed": {"Speed": 35.0, "Timestamp": "2023-04-05T12:00:00Z"},
  "AverageFuelConsumption": {"FuelConsumed": 18.5, "Timestamp": "2023-04-05T12:00:00Z"}
}`,
        notes: "DEFRemaining (AdBlue) é crítico para motores Tier 4 Final e Stage V. Abaixo de 10% o motor pode entrar em modo derate reduzindo a potência.",
      },
      {
        id: "hitachi-fault-codes",
        method: "GET",
        path: "/telematics/v1/faultcodes",
        description:
          "[ISO 15143-3 Timeseries] Retorna códigos de falha ativos (DTC) com identificador, descrição, severidade e fonte. Histórico de até 14 dias. Essencial para diagnóstico remoto e manutenção preventiva.",
        fields: [
          { field: "EquipmentID", type: "String", description: "ID do equipamento", example: '"EQP-001"', pragmaticUse: "Identificação do equipamento" },
          { field: "Timestamp", type: "DateTime", description: "Data/hora da falha", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Ordenação cronológica das falhas" },
          { field: "FaultCode", type: "String", description: "Código de falha (DTC) — ex: P0101, P0102", example: '"P0101"', pragmaticUse: "Identificação do tipo de falha para diagnóstico" },
          { field: "FaultDescription", type: "String", description: "Descrição textual da falha", example: '"Mass Airflow Sensor Circuit Range/Performance"', pragmaticUse: "Compreensão do problema em linguagem natural" },
          { field: "Severity", type: "String", description: "Nível de severidade: CRITICAL, HIGH, MEDIUM, LOW", example: '"HIGH"', pragmaticUse: "Priorização de manutenção — CRITICAL requer ação imediata" },
          { field: "Source", type: "String", description: "Origem da falha: Engine, Transmission, Hydraulic, Electrical", example: '"Engine"', pragmaticUse: "Localização do sistema afetado" },
          { field: "OccurrenceCount", type: "Integer", description: "Número de ocorrências da falha", example: "3", pragmaticUse: "Identificação de problemas intermitentes vs. persistentes" },
        ],
        jsonExample: `{
  "FaultCodes": [{
    "EquipmentID": "EQP-001",
    "Timestamp": "2023-04-05T12:00:00Z",
    "FaultCode": "P0101",
    "FaultDescription": "Mass Airflow Sensor Circuit Range/Performance",
    "Severity": "HIGH",
    "Source": "Engine",
    "OccurrenceCount": 3
  }]
}`,
        notes: "Campos com prefixo [ISO 15143-3] são padrão. Campos com [Hitachi P-API Proprietário] são extensões Hitachi não disponíveis em outras OEMs.",
      },
      {
        id: "hitachi-switch-status",
        method: "GET",
        path: "/telematics/v1/switchstatus",
        description:
          "[ISO 15143-3 Timeseries] Retorna o estado de entradas digitais (interruptores, sensores) — ex: PTO ativo, porta aberta, modo trabalho. Timeseries com histórico completo.",
        fields: [
          { field: "EquipmentID", type: "String", description: "ID do equipamento", example: '"EQP-001"', pragmaticUse: "Identificação do equipamento" },
          { field: "Timestamp", type: "DateTime", description: "Data/hora da mudança de estado", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Ordenação cronológica das mudanças" },
          { field: "SwitchName", type: "String", description: "Nome do interruptor/sensor", example: '"PTO_Active", "Door_Open", "WorkMode"', pragmaticUse: "Identificação do componente monitorado" },
          { field: "SwitchState", type: "Boolean", description: "Estado do interruptor: true (ativo) ou false (inativo)", example: "true", pragmaticUse: "Detecção de mudanças de estado em tempo real" },
          { field: "Duration", type: "Double", description: "Duração do estado em minutos", example: "45.5", pragmaticUse: "Análise de tempo de operação de implementos" },
        ],
        jsonExample: `{
  "SwitchStatus": [{
    "EquipmentID": "EQP-001",
    "Timestamp": "2023-04-05T12:00:00Z",
    "SwitchName": "PTO_Active",
    "SwitchState": true,
    "Duration": 45.5
  }]
}`,
        notes: "Timeseries obrigatório do padrão ISO 15143-3. Monitora estado de implementos e entradas digitais.",
      },
      {
        id: "hitachi-timeseries",
        method: "GET",
        path: "/telematics/v1/timeseries",
        description:
          "Retorna dados históricos de telemetria em série temporal para um equipamento específico. Permite análise de tendências ao longo do tempo. Inclui dados ISO padrão e extensões proprietárias Hitachi.",
        fields: [
          { field: "EquipmentID", type: "String", description: "ID do equipamento", example: '"EQP-001"', pragmaticUse: "Identificação do equipamento nos dados históricos" },
          { field: "Timestamp", type: "DateTime", description: "Data/hora da leitura", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Ordenação cronológica dos dados históricos" },
          { field: "OperatingHours", type: "Double", description: "[ISO 15143-3] Horas de operação no momento da leitura", example: "1234.5", pragmaticUse: "Análise de tendência de uso ao longo do tempo" },
          { field: "FuelLevel", type: "Double", description: "[ISO 15143-3] Nível de combustível no momento da leitura (%)", example: "75.5", pragmaticUse: "Análise de padrões de consumo de combustível" },
          { field: "DEFLevel", type: "Double", description: "[ISO 15143-3] Nível de DEF/AdBlue no momento da leitura (%)", example: "80.0", pragmaticUse: "Monitoramento da taxa de consumo de DEF" },
          { field: "EngineRPM", type: "Integer", description: "[Hitachi P-API Proprietário] Rotações por minuto do motor", example: "1800", pragmaticUse: "Análise de carga do motor e eficiência operacional" },
          { field: "CoolantTemp", type: "Integer", description: "[Hitachi P-API Proprietário] Temperatura do líquido de arrefecimento (°C)", example: "90", pragmaticUse: "Prevenção de superaquecimento e diagnóstico" },
          { field: "HydraulicOilTemp", type: "Integer", description: "[Hitachi P-API Proprietário] Temperatura do óleo hidráulico (°C)", example: "65", pragmaticUse: "Monitoramento do sistema hidráulico" },
        ],
        jsonExample: `{
  "TimeSeries": [{
    "EquipmentID": "EQP-001",
    "Timestamp": "2023-04-05T12:00:00Z",
    "OperatingHours": 1234.5,
    "FuelLevel": 75.5,
    "DEFLevel": 80.0,
    "EngineRPM": 1800,
    "CoolantTemp": 90,
    "HydraulicOilTemp": 65
  }]
}`,
        notes: "Campos com prefixo [ISO 15143-3] são padrão. Campos com [Hitachi P-API Proprietário] são extensões Hitachi não disponíveis em outras OEMs.",
      },
    ],
  },

  // ============================================================
  // 4. PROEMION DATAPORTAL & DATAPLATFORM API
  // ============================================================
  {
    id: "proemion",
    name: "Proemion DataPortal & DataPlatform API",
    color: "#7c3aed",
    icon: "🔧",
    baseUrl: "https://services.proemion.com/proemion-ws",
    authType: "SOAP WS-Security / Token de Sessão (AuthService)",
    docUrl: "https://services.proemion.com/",
    description:
      "A Proemion DataPortal & DataPlatform API oferece serviços SOAP para gestão completa de máquinas, dispositivos, utilizadores, ficheiros, diagnósticos e mapeamento. Inclui catálogo de sinais OEM (CAN bus) com dados brutos de sensores.",
    endpoints: [
      {
        id: "proemion-auth",
        method: "SOAP",
        path: "/ws-proemion-auth/2009/01/15/AuthService",
        description:
          "Serviço de autenticação. Fornece métodos para login, gestão de tokens de sessão e sub-tokens para acesso à API.",
        fields: [
          { field: "clientLogin.username", type: "String", description: "Nome de utilizador para autenticação", example: '"admin@fazenda.com"', pragmaticUse: "Autenticação inicial para obter token de sessão" },
          { field: "clientLogin.password", type: "String", description: "Palavra-passe do utilizador", example: '"senha_segura"', pragmaticUse: "Credencial de acesso à plataforma" },
          { field: "clientLogin.return.sessionToken", type: "String", description: "Token de sessão retornado após login", example: '"SESSION-TOKEN-ABC123"', pragmaticUse: "Token para autenticar todas as chamadas subsequentes" },
          { field: "authSubTokenInfo.token", type: "String", description: "Informações sobre um sub-token", example: '"SUB-TOKEN-XYZ"', pragmaticUse: "Verificação de validade e permissões do sub-token" },
          { field: "authSubRevokeToken.token", type: "String", description: "Token a ser revogado", example: '"TOKEN-TO-REVOKE"', pragmaticUse: "Revogação de tokens expirados ou comprometidos" },
          { field: "authSubSessionToken.return", type: "String", description: "Sub-token de sessão gerado", example: '"SUB-SESSION-TOKEN"', pragmaticUse: "Criação de tokens de acesso limitado para aplicações" },
        ],
        jsonExample: `<!-- Exemplo SOAP: clientLogin -->
<soapenv:Envelope>
  <soapenv:Body>
    <clientLogin>
      <username>admin@fazenda.com</username>
      <password>senha_segura</password>
    </clientLogin>
  </soapenv:Body>
</soapenv:Envelope>

<!-- Resposta -->
<clientLoginResponse>
  <return>
    <sessionToken>SESSION-TOKEN-ABC123</sessionToken>
    <expiresAt>2023-04-05T20:00:00Z</expiresAt>
  </return>
</clientLoginResponse>`,
        notes: "Métodos disponíveis: clientLogin, authSubTokenInfo, authSubRevokeToken, authSubSessionToken.",
      },
      {
        id: "proemion-admin-machine",
        method: "SOAP",
        path: "/ws-proemion-admin2/2009/07/16/AdminMachineService",
        description:
          "Serviço de administração de máquinas. Permite ler detalhes de máquinas individuais e listar todas as máquinas visíveis para a conta.",
        fields: [
          { field: "machineRead.machineId", type: "Long", description: "ID da máquina a ser lida", example: "12345", pragmaticUse: "Consulta de detalhes de uma máquina específica" },
          { field: "machineRead.return.machineId", type: "Long", description: "Identificador único da máquina", example: "12345", pragmaticUse: "Referência para operações subsequentes sobre a máquina" },
          { field: "machineRead.return.name", type: "String", description: "Nome da máquina", example: '"Colheitadeira 1"', pragmaticUse: "Exibição na interface do utilizador" },
          { field: "machineRead.return.serial", type: "String", description: "Número de série da máquina", example: '"PROEMION-SN-001"', pragmaticUse: "Rastreamento e inventário" },
          { field: "machineRead.return.model", type: "String", description: "Modelo da máquina", example: '"HarvestMaster 5000"', pragmaticUse: "Detalhes técnicos e compatibilidade de peças" },
          { field: "machineRead.return.manufacturer", type: "String", description: "Fabricante da máquina", example: '"CLAAS"', pragmaticUse: "Identificação do fabricante para suporte técnico" },
          { field: "machineRead.return.type", type: "String", description: "Tipo da máquina", example: '"Harvester"', pragmaticUse: "Categorização por tipo de equipamento" },
          { field: "machineRead.return.year", type: "Integer", description: "Ano de fabricação", example: "2021", pragmaticUse: "Cálculo de idade e planejamento de substituição" },
          { field: "getAllVisibleAdminMachines.return", type: "Array", description: "Lista de todas as máquinas visíveis", example: '[{"machineId":12345,"name":"Colheitadeira 1"}]', pragmaticUse: "Inventário completo da frota para gestão" },
        ],
        jsonExample: `<!-- Exemplo SOAP: machineRead -->
<machineReadResponse>
  <return>
    <machineId>12345</machineId>
    <name>Colheitadeira 1</name>
    <serial>PROEMION-SN-001</serial>
    <model>HarvestMaster 5000</model>
    <manufacturer>CLAAS</manufacturer>
    <type>Harvester</type>
    <year>2021</year>
    <deviceId>67890</deviceId>
  </return>
</machineReadResponse>`,
        notes: "Métodos disponíveis: machineRead, getAllVisibleAdminMachines.",
      },
      {
        id: "proemion-status",
        method: "SOAP",
        path: "/ws-proemion-status/2009/07/16/StatusService",
        description:
          "Serviço de status operacional. Retorna o estado em tempo real de máquinas e dispositivos, incluindo conectividade e estado do motor.",
        fields: [
          { field: "getStatusByMachineIds.machineId", type: "Long", description: "ID da máquina para consulta de status", example: "12345", pragmaticUse: "Consulta de status de uma ou mais máquinas específicas" },
          { field: "return.machineId", type: "Long", description: "ID da máquina no resultado", example: "12345", pragmaticUse: "Associação do status à máquina correta" },
          { field: "return.online", type: "Boolean", description: "Indica se a máquina está online", example: "true", pragmaticUse: "Monitoramento da conectividade da frota" },
          { field: "return.lastContact", type: "DateTime", description: "Data/hora do último contacto com a máquina", example: '"2023-04-05T12:05:30Z"', pragmaticUse: "Verificação de atividade recente e detecção de máquinas offline" },
          { field: "return.engineRunning", type: "Boolean", description: "Indica se o motor está ligado", example: "true", pragmaticUse: "Monitoramento do estado de funcionamento do motor" },
          { field: "return.latitude", type: "Double", description: "Latitude atual da máquina", example: "34.5678", pragmaticUse: "Posição atual para exibição em mapa" },
          { field: "return.longitude", type: "Double", description: "Longitude atual da máquina", example: "-118.1234", pragmaticUse: "Posição atual para exibição em mapa" },
          { field: "getMachineStates.return", type: "Array", description: "Estados de múltiplas máquinas", example: '[{"machineId":12345,"state":"WORKING"}]', pragmaticUse: "Visão geral do estado operacional de toda a frota" },
          { field: "getStatusByDeviceIds.deviceId", type: "Long", description: "ID do dispositivo para consulta de status", example: "67890", pragmaticUse: "Monitoramento do estado do dispositivo telemático" },
          { field: "getDeviceStates.return", type: "Array", description: "Estados de múltiplos dispositivos", example: '[{"deviceId":67890,"connected":true}]', pragmaticUse: "Diagnóstico de conectividade de dispositivos" },
          { field: "heartbeat.return", type: "Boolean", description: "Confirmação de que o serviço está ativo", example: "true", pragmaticUse: "Verificação de disponibilidade do serviço" },
        ],
        jsonExample: `<!-- Exemplo SOAP: getStatusByMachineIds -->
<getStatusByMachineIdsResponse>
  <return>
    <machineId>12345</machineId>
    <online>true</online>
    <lastContact>2023-04-05T12:05:30Z</lastContact>
    <engineRunning>true</engineRunning>
    <latitude>34.5678</latitude>
    <longitude>-118.1234</longitude>
    <speed>15.5</speed>
    <heading>270</heading>
  </return>
</getStatusByMachineIdsResponse>`,
        notes: "Métodos disponíveis: getStatusByMachineIds, getMachineStates, getStatusByDeviceIds, getDeviceStates, heartbeat.",
      },
      {
        id: "proemion-mapping",
        method: "SOAP",
        path: "/ws-proemion-mapping/2009/01/15/MappingService",
        description:
          "Serviço de mapeamento. Fornece a última posição conhecida de objetos (máquinas) para exibição em mapas.",
        fields: [
          { field: "getLastKnownPositionForObject.objectId", type: "Long", description: "ID do objeto (máquina) para consulta de posição", example: "12345", pragmaticUse: "Consulta da última posição conhecida de uma máquina" },
          { field: "return.objectId", type: "Long", description: "ID do objeto no resultado", example: "12345", pragmaticUse: "Associação da localização à máquina correta" },
          { field: "return.latitude", type: "Double", description: "Latitude da última posição conhecida", example: "34.5678", pragmaticUse: "Exibição da última posição em mapa mesmo sem conectividade atual" },
          { field: "return.longitude", type: "Double", description: "Longitude da última posição conhecida", example: "-118.1234", pragmaticUse: "Exibição da última posição em mapa" },
          { field: "return.timestamp", type: "DateTime", description: "Data/hora da última posição registada", example: '"2023-04-05T12:05:30Z"', pragmaticUse: "Indicação da atualidade dos dados de localização" },
          { field: "return.altitude", type: "Double", description: "Altitude da última posição (metros)", example: "500.0", pragmaticUse: "Informação de elevação para análise de terreno" },
          { field: "return.speed", type: "Double", description: "Velocidade no momento da última posição (km/h)", example: "0.0", pragmaticUse: "Verificação se a máquina estava parada ou em movimento" },
          { field: "return.heading", type: "Integer", description: "Direção em graus no momento da última posição", example: "270", pragmaticUse: "Orientação da máquina na última posição conhecida" },
        ],
        jsonExample: `<!-- Exemplo SOAP: getLastKnownPositionForObject -->
<getLastKnownPositionForObjectResponse>
  <return>
    <objectId>12345</objectId>
    <latitude>34.5678</latitude>
    <longitude>-118.1234</longitude>
    <timestamp>2023-04-05T12:05:30Z</timestamp>
    <altitude>500.0</altitude>
    <speed>0.0</speed>
    <heading>270</heading>
  </return>
</getLastKnownPositionForObjectResponse>`,
        notes: "Método disponível: getLastKnownPositionForObject. Retorna a última posição mesmo quando a máquina está offline.",
      },
      {
        id: "proemion-device",
        method: "SOAP",
        path: "/ws-proemion-device/2012/03/13/DeviceService",
        description:
          "Serviço de gestão de dispositivos telemáticos. Permite obter informações de hardware, volume de transferência de dados e alterar o modo do dispositivo.",
        fields: [
          { field: "getHWInformation.deviceId", type: "Long", description: "ID do dispositivo para consulta de hardware", example: "67890", pragmaticUse: "Consulta de informações de hardware do dispositivo" },
          { field: "return.firmwareVersion", type: "String", description: "Versão do firmware do dispositivo", example: '"v2.3.1"', pragmaticUse: "Gestão de atualizações de firmware" },
          { field: "return.hardwareVersion", type: "String", description: "Versão do hardware do dispositivo", example: '"HW-Rev-B"', pragmaticUse: "Identificação da revisão de hardware para suporte" },
          { field: "return.imei", type: "String", description: "IMEI do módulo celular do dispositivo", example: '"352099001761481"', pragmaticUse: "Identificação única do módulo celular" },
          { field: "return.iccid", type: "String", description: "ICCID do cartão SIM", example: '"8955901012345678901"', pragmaticUse: "Gestão de cartões SIM e operadoras" },
          { field: "getDataTransferVolume.return.uploadBytes", type: "Long", description: "Volume de dados enviados (bytes)", example: "1048576", pragmaticUse: "Monitoramento do consumo de dados móveis" },
          { field: "getDataTransferVolume.return.downloadBytes", type: "Long", description: "Volume de dados recebidos (bytes)", example: "524288", pragmaticUse: "Controle de custos de dados e planos de conectividade" },
          { field: "changeDeviceModeTo.mode", type: "String", description: "Modo a ser configurado no dispositivo", example: '"NORMAL"', pragmaticUse: "Alteração do modo de operação: NORMAL, LOW_POWER, SLEEP" },
        ],
        jsonExample: `<!-- Exemplo SOAP: getHWInformation -->
<getHWInformationResponse>
  <return>
    <firmwareVersion>v2.3.1</firmwareVersion>
    <hardwareVersion>HW-Rev-B</hardwareVersion>
    <imei>352099001761481</imei>
    <iccid>8955901012345678901</iccid>
    <signalStrength>85</signalStrength>
    <batteryVoltage>12.6</batteryVoltage>
  </return>
</getHWInformationResponse>`,
        notes: "Métodos disponíveis: getHWInformation, getDataTransferVolume, changeDeviceModeTo.",
      },
      {
        id: "proemion-diag",
        method: "SOAP",
        path: "/ws-proemion-diag/2009/01/15/DiagService",
        description:
          "Serviço de diagnóstico. Retorna o status de diagnóstico e informações detalhadas de diagnóstico para máquinas e dispositivos.",
        fields: [
          { field: "getStatus.machineId", type: "Long", description: "ID da máquina para diagnóstico", example: "12345", pragmaticUse: "Consulta do status de diagnóstico de uma máquina" },
          { field: "return.status", type: "String", description: "Status geral de diagnóstico", example: '"OK"', pragmaticUse: "Avaliação rápida da saúde da máquina" },
          { field: "return.activeFaults", type: "Integer", description: "Número de falhas ativas", example: "2", pragmaticUse: "Priorização de manutenção corretiva" },
          { field: "getDiagnosis.return.faultCode", type: "String", description: "Código de falha diagnóstica", example: '"P0300"', pragmaticUse: "Diagnóstico técnico e identificação de problemas" },
          { field: "getDiagnosis.return.description", type: "String", description: "Descrição da falha", example: '"Misfire Detected"', pragmaticUse: "Informação amigável para técnicos de manutenção" },
          { field: "getDiagnosis.return.severity", type: "String", description: "Severidade da falha", example: '"HIGH"', pragmaticUse: "Priorização de intervenção de manutenção" },
          { field: "getDiagnosis.return.timestamp", type: "DateTime", description: "Data/hora da ocorrência da falha", example: '"2023-04-05T12:00:00Z"', pragmaticUse: "Rastreamento cronológico de falhas" },
        ],
        jsonExample: `<!-- Exemplo SOAP: getDiagnosis -->
<getDiagnosisResponse>
  <return>
    <machineId>12345</machineId>
    <status>WARNING</status>
    <activeFaults>2</activeFaults>
    <faults>
      <fault>
        <faultCode>P0300</faultCode>
        <description>Misfire Detected</description>
        <severity>HIGH</severity>
        <timestamp>2023-04-05T12:00:00Z</timestamp>
      </fault>
    </faults>
  </return>
</getDiagnosisResponse>`,
        notes: "Métodos disponíveis: getStatus, getDiagnosis.",
      },
      {
        id: "proemion-admin-device",
        method: "SOAP",
        path: "/ws-proemion-admin2/2009/07/16/AdminDeviceService",
        description:
          "Serviço de administração de dispositivos. Permite listar, ler detalhes e gerir dispositivos telemáticos registados na plataforma.",
        fields: [
          { field: "getAllVisibleAdminDevices.return", type: "Array", description: "Lista de todos os dispositivos visíveis", example: '[{"deviceId":67890,"serial":"DEV-001"}]', pragmaticUse: "Inventário completo de dispositivos telemáticos" },
          { field: "getDeviceDetails.deviceId", type: "Long", description: "ID do dispositivo para consulta de detalhes", example: "67890", pragmaticUse: "Consulta de detalhes de um dispositivo específico" },
          { field: "deviceRead.return.deviceId", type: "Long", description: "ID único do dispositivo", example: "67890", pragmaticUse: "Referência para operações sobre o dispositivo" },
          { field: "deviceRead.return.serial", type: "String", description: "Número de série do dispositivo", example: '"DEV-001"', pragmaticUse: "Identificação física do hardware" },
          { field: "deviceRead.return.type", type: "String", description: "Tipo do dispositivo telemático", example: '"GPS_TRACKER"', pragmaticUse: "Classificação do tipo de hardware" },
          { field: "deviceRead.return.machineId", type: "Long", description: "ID da máquina associada ao dispositivo", example: "12345", pragmaticUse: "Associação dispositivo-máquina" },
          { field: "getDevices.return", type: "Array", description: "Lista de dispositivos com filtros", example: '[{"deviceId":67890,"online":true}]', pragmaticUse: "Listagem filtrada de dispositivos por estado ou tipo" },
        ],
        jsonExample: `<!-- Exemplo SOAP: deviceRead -->
<deviceReadResponse>
  <return>
    <deviceId>67890</deviceId>
    <serial>DEV-001</serial>
    <type>GPS_TRACKER</type>
    <machineId>12345</machineId>
    <online>true</online>
    <lastSeen>2023-04-05T12:05:30Z</lastSeen>
  </return>
</deviceReadResponse>`,
        notes: "Métodos disponíveis: getAllVisibleAdminDevices, getDeviceDetails, deviceRead, getDevices.",
      },
      {
        id: "proemion-file",
        method: "SOAP",
        path: "/ws-proemion-file2/2009/07/16/FileService",
        description:
          "Serviço de gestão de ficheiros. Permite upload/download de firmware, ficheiros de configuração e DBS (Database Sets) para máquinas e dispositivos.",
        fields: [
          { field: "listDbsForMachine.machineId", type: "Long", description: "ID da máquina para listar DBS", example: "12345", pragmaticUse: "Listagem de bases de dados de sinais disponíveis para a máquina" },
          { field: "searchFiles.return", type: "Array", description: "Lista de ficheiros disponíveis", example: '[{"fileId":"file-001","name":"config.bin"}]', pragmaticUse: "Pesquisa de ficheiros de configuração disponíveis" },
          { field: "downloadFiles.fileId", type: "String", description: "ID do ficheiro a descarregar", example: '"file-001"', pragmaticUse: "Download de ficheiros de configuração ou logs" },
          { field: "uploadFirmwareToDevice.deviceId", type: "Long", description: "ID do dispositivo para upload de firmware", example: "67890", pragmaticUse: "Atualização remota de firmware do dispositivo" },
          { field: "uploadFirmwareToMachine.machineId", type: "Long", description: "ID da máquina para upload de firmware", example: "12345", pragmaticUse: "Atualização remota de firmware da ECU da máquina" },
          { field: "getDbsConfiguration.return", type: "Object", description: "Configuração atual do DBS", example: '{"version":"v3.2","signals":["engineRPM","coolantTemp"]}', pragmaticUse: "Verificação da configuração atual de sinais CAN" },
        ],
        jsonExample: `<!-- Exemplo SOAP: searchFiles -->
<searchFilesResponse>
  <return>
    <file>
      <fileId>file-001</fileId>
      <name>config_machine_12345.bin</name>
      <type>CONFIGURATION</type>
      <size>2048</size>
      <createdAt>2023-04-01T10:00:00Z</createdAt>
    </file>
  </return>
</searchFilesResponse>`,
        notes: "Métodos disponíveis: listDbsForMachine, uploadFirmwareToDevice, deleteDownloadFiles, searchFiles, searchDownloadFiles, searchUploadFiles, markFetchedFiles, getDbsConfiguration, uploadFirmwareToMachine, downloadFiles, uploadFilesToDevice, uploadDbsConfigToMachine, uploadFilesToMachine, uploadFileToMachine, deleteUploadFiles, markFetchedFile.",
      },
      {
        id: "proemion-can-signals",
        method: "SOAP",
        path: "/ws-proemion-admin2/2009/07/16/AdminMachineService (OEM Signal Catalog)",
        description:
          "Catálogo de sinais OEM (CAN bus). Dados brutos de sensores da máquina via barramento CAN. Altamente específicos por fabricante e modelo. Exemplos de sinais comuns disponíveis.",
        fields: [
          { field: "engineRPM", type: "Integer", description: "Rotações por minuto do motor", example: "1800", pragmaticUse: "Monitoramento do desempenho do motor e detecção de sobrecarga" },
          { field: "fuelPressure", type: "Double", description: "Pressão do sistema de combustível (bar)", example: "3.5", pragmaticUse: "Diagnóstico de problemas no sistema de injeção de combustível" },
          { field: "coolantTemp", type: "Integer", description: "Temperatura do líquido de arrefecimento (°C)", example: "90", pragmaticUse: "Prevenção de superaquecimento do motor" },
          { field: "oilPressure", type: "Double", description: "Pressão do óleo do motor (bar)", example: "4.2", pragmaticUse: "Monitoramento da saúde do motor — alerta de baixa pressão" },
          { field: "hydraulicPressure", type: "Double", description: "Pressão do sistema hidráulico (bar)", example: "200.0", pragmaticUse: "Monitoramento do desempenho de implementos hidráulicos" },
          { field: "batteryVoltage", type: "Double", description: "Tensão da bateria principal (V)", example: "12.6", pragmaticUse: "Monitoramento da saúde da bateria e sistema elétrico" },
          { field: "airFilterPressure", type: "Double", description: "Pressão diferencial do filtro de ar (mbar)", example: "15.0", pragmaticUse: "Indicação de necessidade de limpeza/troca do filtro de ar" },
          { field: "transmissionOilTemp", type: "Integer", description: "Temperatura do óleo da transmissão (°C)", example: "75", pragmaticUse: "Monitoramento da saúde da transmissão" },
          { field: "engineLoad", type: "Integer", description: "Carga do motor em percentual (%)", example: "75", pragmaticUse: "Análise de eficiência e detecção de sobrecarga" },
          { field: "throttlePosition", type: "Integer", description: "Posição do acelerador em percentual (%)", example: "60", pragmaticUse: "Análise do padrão de condução e eficiência" },
          { field: "intakeAirTemp", type: "Integer", description: "Temperatura do ar de admissão (°C)", example: "35", pragmaticUse: "Monitoramento de condições de operação do motor" },
          { field: "exhaustGasTemp", type: "Integer", description: "Temperatura dos gases de escape (°C)", example: "450", pragmaticUse: "Monitoramento do sistema de pós-tratamento (DPF/SCR)" },
          { field: "defConsumptionRate", type: "Double", description: "Taxa de consumo de DEF/AdBlue (L/h)", example: "0.5", pragmaticUse: "Previsão de reabastecimento de DEF e conformidade ambiental" },
          { field: "dpfSootLevel", type: "Integer", description: "Nível de fuligem no filtro de partículas (%)", example: "45", pragmaticUse: "Gestão de regeneração do DPF e manutenção preventiva" },
          { field: "ptoEngaged", type: "Boolean", description: "Estado de engajamento da tomada de força (PTO)", example: "true", pragmaticUse: "Monitoramento do uso de implementos e análise de horas PTO" },
        ],
        jsonExample: `{
  "machineId": 12345,
  "timestamp": "2023-04-05T12:00:00Z",
  "signals": {
    "engineRPM": 1800,
    "fuelPressure": 3.5,
    "coolantTemp": 90,
    "oilPressure": 4.2,
    "hydraulicPressure": 200.0,
    "batteryVoltage": 12.6,
    "airFilterPressure": 15.0,
    "transmissionOilTemp": 75,
    "engineLoad": 75,
    "throttlePosition": 60,
    "intakeAirTemp": 35,
    "exhaustGasTemp": 450,
    "defConsumptionRate": 0.5,
    "dpfSootLevel": 45,
    "ptoEngaged": true
  }
}`,
        notes: "Os sinais disponíveis variam por fabricante (OEM) e modelo específico. O catálogo completo de sinais é obtido via listDbsForMachine e getDbsConfiguration.",
      },
      {
        id: "proemion-runtime",
        method: "SOAP",
        path: "/ws-proemion-admin2/2009/07/16/RuntimeEntitiesService",
        description:
          "Serviço de entidades em tempo de execução. Retorna o estado atual de máquinas, dispositivos e grupos em operação.",
        fields: [
          { field: "getAllVisibleRuntimeMachines.return", type: "Array", description: "Lista de máquinas em runtime com estado atual", example: '[{"machineId":12345,"online":true,"engineOn":true}]', pragmaticUse: "Dashboard em tempo real do estado de toda a frota" },
          { field: "getAllVisibleRuntimeDevices.return", type: "Array", description: "Lista de dispositivos em runtime", example: '[{"deviceId":67890,"connected":true}]', pragmaticUse: "Monitoramento em tempo real de todos os dispositivos" },
          { field: "getRuntimeDeviceDetails.deviceId", type: "Long", description: "ID do dispositivo para detalhes em runtime", example: "67890", pragmaticUse: "Detalhes em tempo real de um dispositivo específico" },
          { field: "getAllVisibleRuntimeMachineGroups.return", type: "Array", description: "Lista de grupos de máquinas em runtime", example: '[{"groupId":1,"name":"Frota Norte","machineCount":5}]', pragmaticUse: "Visão agrupada da frota para gestão por região/projeto" },
          { field: "getAllVisibleRuntimeDeviceGroups.return", type: "Array", description: "Lista de grupos de dispositivos em runtime", example: '[{"groupId":1,"name":"Grupo A","deviceCount":10}]', pragmaticUse: "Gestão agrupada de dispositivos telemáticos" },
        ],
        jsonExample: `<!-- Exemplo SOAP: getAllVisibleRuntimeMachines -->
<getAllVisibleRuntimeMachinesResponse>
  <return>
    <machine>
      <machineId>12345</machineId>
      <name>Colheitadeira 1</name>
      <online>true</online>
      <engineOn>true</engineOn>
      <latitude>34.5678</latitude>
      <longitude>-118.1234</longitude>
      <lastUpdate>2023-04-05T12:05:30Z</lastUpdate>
    </machine>
  </return>
</getAllVisibleRuntimeMachinesResponse>`,
        notes: "Métodos disponíveis: getAllVisibleRuntimeDevices, getAllVisibleRuntimeMachineGroups, getRuntimeDeviceDetails, getAllVisibleRuntimeDeviceGroups, getAllVisibleRuntimeMachines.",
      },
      {
        id: "proemion-management",
        method: "SOAP",
        path: "/ws-proemion-management/2015/11/20/ManagementService",
        description:
          "Serviço de gestão de dispositivos e máquinas. Permite modificar configurações, ativar dispositivos e gerir planos de ativação.",
        fields: [
          { field: "getAvailableActivationPlans.return", type: "Array", description: "Planos de ativação disponíveis", example: '[{"planId":1,"name":"Standard 12 meses"}]', pragmaticUse: "Seleção do plano de conectividade para novos dispositivos" },
          { field: "activateDevices.deviceIds", type: "Array", description: "IDs dos dispositivos a ativar", example: '[67890, 67891]', pragmaticUse: "Ativação em lote de novos dispositivos telemáticos" },
          { field: "modifyDevices.deviceId", type: "Long", description: "ID do dispositivo a modificar", example: "67890", pragmaticUse: "Atualização de configurações do dispositivo" },
          { field: "modifyMachines.machineId", type: "Long", description: "ID da máquina a modificar", example: "12345", pragmaticUse: "Atualização de dados cadastrais da máquina" },
        ],
        jsonExample: `<!-- Exemplo SOAP: activateDevices -->
<activateDevicesResponse>
  <return>
    <success>true</success>
    <activatedDevices>
      <deviceId>67890</deviceId>
      <activationDate>2023-04-05T10:00:00Z</activationDate>
      <planId>1</planId>
    </activatedDevices>
  </return>
</activateDevicesResponse>`,
        notes: "Métodos disponíveis: modifyMachines, getAvailableActivationPlans, modifyDevices, activateDevices.",
      },
    ],
  },
];

export default apiData;
