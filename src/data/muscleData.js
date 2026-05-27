export const muscleData = [
  {
    id: 'peitoral',
    category: 'Superiores',
    name: 'Peitoral',
    image: '/anatomy/pectoral.png',
    description: 'Músculos responsáveis pela adução e rotação do braço, divididos em porções clavicular e esternal. O peitoral maior é o principal motor em movimentos de empurrar.',
    anatomy: ['Peitoral Maior', 'Peitoral Menor', 'Serrátil Anterior'],
    exercises: [
      { 
        name: 'Supino Reto', 
        tip: 'Abaixe a barra até o meio do peito com controle.',
        gif: '/exercises/Academias/Peitoral/Supino.gif'
      },
      { 
        name: 'Crucifixo com Halteres', 
        tip: 'Imagine que está abraçando uma árvore grande.',
        gif: '/exercises/Academias/Peitoral/Crucifixo com halteres.gif'
      },
      { 
        name: 'Cross Over Polia Alta', 
        tip: 'Mantenha o peito estufado e foque no esmagamento no centro.',
        gif: '/exercises/Academias/Peitoral/Cross over polia Alta.gif'
      }
    ]
  },
  {
    id: 'costas',
    category: 'Superiores',
    name: 'Dorsais',
    image: '/anatomy/back.png',
    description: 'Complexo muscular das costas que inclui o latíssimo do dorso e os eretores da espinha. Essencial para postura e força de puxada.',
    anatomy: ['Grande Dorsal', 'Trapézio', 'Romboides', 'Redondo Maior'],
    exercises: [
      { 
        name: 'Puxada Aberta', 
        tip: 'Puxe o peito em direção à barra, não o queixo.',
        gif: '/exercises/Academias/Costas/Puxada Aberta Pulley.gif'
      },
      { 
        name: 'Remada Curvada', 
        tip: 'Mantenha as costas paralelas ao chão.',
        gif: '/exercises/Academias/Costas/Remada Curvada com Barra.gif'
      }
    ]
  },
  {
    id: 'ombros',
    category: 'Superiores',
    name: 'Deltoides',
    image: '/anatomy/shoulder.png',
    description: 'Músculo que recobre a articulação do ombro, permitindo movimentos em todas as direções. Dividido em três cabeças: anterior, lateral e posterior.',
    anatomy: ['Porção Anterior', 'Porção Lateral', 'Porção Posterior'],
    exercises: [
      { 
        name: 'Desenvolvimento Militar', 
        tip: 'Empurre a carga verticalmente sem balançar.',
        gif: '/exercises/Academias/Ombros/Desenvolvimento Militar com Barra.gif'
      },
      { 
        name: 'Elevação Lateral', 
        tip: 'Mantenha os dedos mínimos levemente elevados.',
        gif: '/exercises/Academias/Ombros/Elevao Lateral com Halteres.gif'
      }
    ]
  },
  {
    id: 'quadriceps',
    category: 'Inferiores',
    name: 'Quadríceps',
    image: '/anatomy/quadriceps.png',
    description: 'Grupo muscular massivo da frente da coxa, composto por quatro porções que convergem no tendão patelar. Responsável pela extensão do joelho.',
    anatomy: ['Vasto Lateral', 'Vasto Medial', 'Vasto Intermédio', 'Reto Femoral'],
    exercises: [
      { 
        name: 'Agachamento Livre', 
        tip: 'Mantenha a base sólida e o core contraído.',
        gif: '/exercises/Academias/Pernas/Agachamento no Smith.gif'
      },
      { 
        name: 'Leg Press 45°', 
        tip: 'Não bloqueie totalmente os joelhos no topo.',
        gif: '/exercises/Academias/Pernas/Leg Press Horizontal.gif'
      },
      { 
        name: 'Cadeira Extensora', 
        tip: 'Foque na contração de 1 segundo no topo.',
        gif: '/exercises/Academias/Pernas/Cadeira extensora.gif'
      }
    ]
  },
  {
    id: 'posterior',
    category: 'Inferiores',
    name: 'Isquiotibiais',
    image: '/anatomy/hamstrings.png',
    description: 'Grupo da parte de trás da coxa, cruciais para a flexão do joelho e saúde dos ligamentos. Estabilizam a pelve durante a locomoção.',
    anatomy: ['Bíceps Femoral', 'Semitendinoso', 'Semimembranoso'],
    exercises: [
      { 
        name: 'Stiff', 
        tip: 'Desça a carga rente às pernas mantendo a coluna reta.',
        gif: '/exercises/Academias/Pernas/Stiff com barra.gif'
      },
      { 
        name: 'Mesa Flexora', 
        tip: 'Mantenha o quadril pressionado contra o banco.',
        gif: '/exercises/Academias/Pernas/Mesa flexora.gif'
      }
    ]
  },
  {
    id: 'bracos',
    category: 'Superiores',
    name: 'Braços',
    image: '/anatomy/arms.png',
    description: 'Foco no Bíceps Braquial e Tríceps Braquial. O bíceps é o flexor do cotovelo, enquanto o tríceps é o extensor.',
    anatomy: ['Bíceps (Cabeça Curta/Longa)', 'Tríceps (3 cabeças)', 'Braquial'],
    exercises: [
      { 
        name: 'Rosca Direta', 
        tip: 'Não utilize o corpo para dar impulso.',
        gif: '/exercises/Academias/Bíceps/Rosca Direta com Barra EZ.gif'
      },
      { 
        name: 'Tríceps Testa', 
        tip: 'Mantenha os cotovelos apontados para o teto.',
        gif: '/exercises/Academias/Tríceps/Trceps Testa com Barra EZ.gif'
      }
    ]
  },
  {
    id: 'panturrilha',
    category: 'Inferiores',
    name: 'Panturrilha',
    image: '/anatomy/calves.png',
    description: 'Músculos da parte posterior da perna, essenciais para a locomoção, equilíbrio e explosão. Compostos principalmente pelo gastrocnêmio e sóleo.',
    anatomy: ['Gastrocnêmio Lateral', 'Gastrocnêmio Medial', 'Sóleo'],
    exercises: [
      { 
        name: 'Gêmeos em Pé', 
        tip: 'Alongue o máximo possível na descida e contraia forte no topo.',
        gif: '/exercises/Academias/Panturrilhas/Elevao de Panturrilha em Máquina em pé.gif'
      },
      { 
        name: 'Gêmeos Sentado', 
        tip: 'Foque na porção do sóleo mantendo os joelhos flexionados.',
        gif: '/exercises/Academias/Panturrilhas/Elevao de Panturrilha Sentado com Alavanca.gif'
      },
      { 
        name: 'Panturrilha no Leg Press', 
        tip: 'Mantenha os joelhos quase estendidos e use apenas os tornozelos.',
        gif: '/exercises/Academias/Panturrilhas/Elevao de Panturrilha no Leg Press.gif'
      }
    ]
  }
];
