import React from 'react';
import Svg, { Path, Rect, Circle, Polyline, Line } from 'react-native-svg';

export type NomeIcone =
  | 'coracao'
  | 'pilula'
  | 'relogio'
  | 'camera'
  | 'galeria'
  | 'check'
  | 'desfazer'
  | 'lixeira'
  | 'editar'
  | 'mais'
  | 'busca'
  | 'alerta'
  | 'sobre'
  | 'gota'
  | 'termometro'
  | 'vazio'
  | 'config'
  | 'sino'
  | 'som'
  | 'usuario'
  | 'atualizar';

interface IconeProps {
  nome: NomeIcone;
  tamanho?: number;
  cor?: string;
}

export default function Icone({ nome, tamanho = 22, cor = '#1E293B' }: IconeProps) {
  switch (nome) {
    case 'coracao':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 12 5.09C12.09 3.81 13.76 3 15.5 3C18.58 3 21 5.42 21 8.5C21 14.5 12 21 12 21Z"
            fill={cor}
            stroke={cor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'pilula':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Rect x="7" y="2" width="10" height="20" rx="5" stroke={cor} strokeWidth="2" />
          <Line x1="7" y1="12" x2="17" y2="12" stroke={cor} strokeWidth="2" />
          <Circle cx="12" cy="7" r="1" fill={cor} />
        </Svg>
      );

    case 'relogio':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={cor} strokeWidth="2" />
          <Polyline
            points="12 7 12 12 15.5 14"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'camera':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 8C4 6.89543 4.89543 6 6 6H8.5L10 4H14L15.5 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="13" r="3.5" stroke={cor} strokeWidth="2" />
        </Svg>
      );

    case 'galeria':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="16" rx="3" stroke={cor} strokeWidth="2" />
          <Circle cx="8.5" cy="9.5" r="1.5" fill={cor} />
          <Path d="M4 17L9 12L13 16L16 13L20 17" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'check':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Polyline points="5 13 9.5 17.5 19 7" stroke={cor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'desfazer':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path d="M9 14L4 9L9 4" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 9H14.5C17.5376 9 20 11.4624 20 14.5C20 17.5376 17.5376 20 14.5 20H11" stroke={cor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'lixeira':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path d="M4 7H20" stroke={cor} strokeWidth="2" strokeLinecap="round" />
          <Path d="M9 4H15" stroke={cor} strokeWidth="2" strokeLinecap="round" />
          <Path d="M6 7L7 19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19L18 7" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
          <Line x1="10" y1="11" x2="10" y2="17" stroke={cor} strokeWidth="2" strokeLinecap="round" />
          <Line x1="14" y1="11" x2="14" y2="17" stroke={cor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'editar':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path d="M15.5 4.5L19.5 8.5L8 20H4V16L15.5 4.5Z" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
        </Svg>
      );

    case 'mais':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Line x1="12" y1="5" x2="12" y2="19" stroke={cor} strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="5" y1="12" x2="19" y2="12" stroke={cor} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    case 'busca':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={cor} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="20.5" y2="20.5" stroke={cor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'alerta':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3L21 19H3L12 3Z" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
          <Line x1="12" y1="10" x2="12" y2="14" stroke={cor} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="12" cy="16.8" r="1" fill={cor} />
        </Svg>
      );

    case 'sobre':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="9" stroke={cor} strokeWidth="2" />
          <Line x1="12" y1="11" x2="12" y2="16" stroke={cor} strokeWidth="2" strokeLinecap="round" />
          <Circle cx="12" cy="8" r="1.2" fill={cor} />
        </Svg>
      );

    case 'gota':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 3C12 3 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 3 12 3Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'termometro':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M14 14.76V4C14 2.9 13.1 2 12 2C10.9 2 10 2.9 10 4V14.76C8.19 15.68 7 17.56 7 19.5C7 22.26 9.24 22 12 22C14.76 22 17 22.26 17 19.5C17 17.56 15.81 15.68 14 14.76Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="19" r="2" fill={cor} />
          <Line x1="12" y1="6" x2="12" y2="17" stroke={cor} strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'vazio':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 80 80" fill="none">
          <Rect x="18" y="20" width="44" height="48" rx="10" fill="#FECDD3" stroke="#E11D48" strokeWidth="2" />
          <Rect x="28" y="16" width="24" height="10" rx="4" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1.5" />
          <Path
            d="M40 40C40 40 32 46 32 50C32 53 35.4 55 40 55C44.6 55 48 53 48 50C48 46 40 40 40 40Z"
            fill="#FB7185"
            stroke="#E11D48"
            strokeWidth="1.5"
          />
          <Line x1="27" y1="34" x2="53" y2="34" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    case 'config':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="3" stroke={cor} strokeWidth="2" />
          <Path
            d="M19.4 15A1.65 1.65 0 0 0 19.73 16.82L19.79 16.88A2 2 0 1 1 16.96 19.71L16.9 19.65A1.65 1.65 0 0 0 15.08 19.32A1.65 1.65 0 0 0 14 20.85V21A2 2 0 1 1 10 21V20.91A1.65 1.65 0 0 0 8.92 19.4A1.65 1.65 0 0 0 7.1 19.73L7.04 19.79A2 2 0 1 1 4.21 16.96L4.27 16.9A1.65 1.65 0 0 0 4.6 15.08A1.65 1.65 0 0 0 3.07 14H3A2 2 0 1 1 3 10H3.09A1.65 1.65 0 0 0 4.6 8.92A1.65 1.65 0 0 0 4.27 7.1L4.21 7.04A2 2 0 1 1 7.04 4.21L7.1 4.27A1.65 1.65 0 0 0 8.92 4.6H9A1.65 1.65 0 0 0 10 3.09V3A2 2 0 1 1 14 3V3.09A1.65 1.65 0 0 0 15.08 4.6A1.65 1.65 0 0 0 16.9 4.27L16.96 4.21A2 2 0 1 1 19.79 7.04L19.73 7.1A1.65 1.65 0 0 0 19.4 8.92V9A1.65 1.65 0 0 0 20.91 10H21A2 2 0 1 1 21 14H20.91A1.65 1.65 0 0 0 19.4 15Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'sino':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M13.73 21A2 2 0 0 1 10.27 21"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'som':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            stroke={cor}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Path
            d="M15.54 8.46A5 5 0 0 1 15.54 15.54"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M19.07 4.93A10 10 0 0 1 19.07 19.07"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'usuario':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="8" r="4" stroke={cor} strokeWidth="2" />
          <Path
            d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'atualizar':
      return (
        <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
          <Path d="M21 4V10H15" stroke={cor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path
            d="M20.49 15A9 9 0 1 1 18.36 5.64L21 10"
            stroke={cor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}
