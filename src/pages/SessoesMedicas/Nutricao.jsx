import AreaSaudeBase from "./AreaSaudeBase";

export default function Nutricao() {
  return (
    <AreaSaudeBase
      title="Nutrição"
      specialty="nutricao"
      subtitleMedicalCommittee="Área específica de nutrição para registro e acompanhamento"
      subtitleReadOnly="Registros de nutrição em modo somente leitura"
    />
  );
}
