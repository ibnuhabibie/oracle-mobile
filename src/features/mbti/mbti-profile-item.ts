import EnfjIcon from "../../components/icons/mbti/enfj";
import EnfpIcon from "../../components/icons/mbti/enfp";
import EntjIcon from "../../components/icons/mbti/entj";
import EntpIcon from "../../components/icons/mbti/entp";
import EsfjIcon from "../../components/icons/mbti/esfj";
import EsfpIcon from "../../components/icons/mbti/esfp";
import EstjIcon from "../../components/icons/mbti/estj";
import EstpIcon from "../../components/icons/mbti/estp";
import InfjIcon from "../../components/icons/mbti/infj";
import InfpIcon from "../../components/icons/mbti/infp";
import IntjIcon from "../../components/icons/mbti/intj";
import IntpIcon from "../../components/icons/mbti/intp";
import IsfjIcon from "../../components/icons/mbti/isfj";
import IsfpIcon from "../../components/icons/mbti/isfp";
import IstjIcon from "../../components/icons/mbti/istj";
import IstpIcon from "../../components/icons/mbti/istp";

export const mbtiIconMap: Record<string, React.FC<{ size?: number; color?: string }>> = {
  ENFJ: EnfjIcon,
  ENFP: EnfpIcon,
  ENTJ: EntjIcon,
  ENTP: EntpIcon,
  ESFJ: EsfjIcon,
  ESFP: EsfpIcon,
  ESTJ: EstjIcon,
  ESTP: EstpIcon,
  INFJ: InfjIcon,
  INFP: InfpIcon,
  INTJ: IntjIcon,
  INTP: IntpIcon,
  ISFJ: IsfjIcon,
  ISFP: IsfpIcon,
  ISTJ: IstjIcon,
  ISTP: IstpIcon,
};

export function getMbtiIconComponent(type: string | undefined) {
  console.log(type)
  if (!type) return null;
  const key = type.toUpperCase();
  return mbtiIconMap[key] || null;
}

export default getMbtiIconComponent;
