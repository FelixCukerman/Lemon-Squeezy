const DEMO_RECIPES = [
  {
    id: "lemonsqueezy-demo-01",
    title: "Сирники з ваніллю",
    description: "Ніжні сирники з рум’яною скоринкою та м’якою серединкою.",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Сніданки"],
    difficulty: "easy",
    totalTimeMinutes: 25,
    servings: 3,
    ingredients: [
      {
        name: "Кисломолочний сир",
        amount: "450",
        unit: "г",
      },
      {
        name: "Яйце",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Борошно",
        amount: "65",
        unit: "г",
      },
      {
        name: "Цукор",
        amount: "35",
        unit: "г",
      },
      {
        name: "Ванільний цукор",
        amount: "8",
        unit: "г",
      },
      {
        name: "Олія",
        amount: "15",
        unit: "мл",
      },
    ],
    steps: [
      {
        text: "Розітріть сир із яйцем, цукром і ванільним цукром.",
        imageUrl: "",
      },
      {
        text: "Додайте борошно й перемішайте до пластичної маси.",
        imageUrl: "",
      },
      {
        text: "Сформуйте невеликі сирники, злегка обкачайте в борошні.",
        imageUrl: "",
      },
      {
        text: "Смажте на помірному вогні по 3–4 хвилини з кожного боку до готовності.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-02",
    title: "Шакшука з солодким перцем",
    description: "Яйця в густому томатному соусі з паприкою та зеленню.",
    imageUrl:
      "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Сніданки"],
    difficulty: "easy",
    totalTimeMinutes: 30,
    servings: 2,
    ingredients: [
      {
        name: "Яйця",
        amount: "4",
        unit: "шт.",
      },
      {
        name: "Помідори у власному соку",
        amount: "400",
        unit: "г",
      },
      {
        name: "Перець солодкий",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Цибуля",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Часник",
        amount: "2",
        unit: "зубчики",
      },
      {
        name: "Оливкова олія",
        amount: "20",
        unit: "мл",
      },
      {
        name: "Паприка",
        amount: "1",
        unit: "ч. л.",
      },
    ],
    steps: [
      {
        text: "Наріжте цибулю та перець, обсмажте в олії 5 хвилин.",
        imageUrl: "",
      },
      {
        text: "Додайте подрібнений часник і паприку, прогрійте 30 секунд.",
        imageUrl: "",
      },
      {
        text: "Додайте помідори й тушкуйте 10 хвилин, приправте.",
        imageUrl: "",
      },
      {
        text: "Зробіть чотири заглиблення, вбийте яйця й готуйте під кришкою до бажаної готовності білків.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-03",
    title: "Салат із кус-кусом та фетою",
    description: "Свіжий середземноморський салат з овочами, лимоном і м’ятою.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Салати"],
    difficulty: "easy",
    totalTimeMinutes: 20,
    servings: 3,
    ingredients: [
      {
        name: "Кус-кус",
        amount: "180",
        unit: "г",
      },
      {
        name: "Окріп",
        amount: "200",
        unit: "мл",
      },
      {
        name: "Помідори чері",
        amount: "220",
        unit: "г",
      },
      {
        name: "Огірок",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Фета",
        amount: "150",
        unit: "г",
      },
      {
        name: "Оливкова олія",
        amount: "30",
        unit: "мл",
      },
      {
        name: "Лимонний сік",
        amount: "15",
        unit: "мл",
      },
      {
        name: "М’ята",
        amount: "10",
        unit: "г",
      },
    ],
    steps: [
      {
        text: "Залийте кус-кус окропом, накрийте на 7 хвилин і розпушіть виделкою.",
        imageUrl: "",
      },
      {
        text: "Наріжте огірок, помідори та фету.",
        imageUrl: "",
      },
      {
        text: "Змішайте олію, лимонний сік і дрібку солі.",
        imageUrl: "",
      },
      {
        text: "З’єднайте всі інгредієнти, додайте м’яту й заправку.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-04",
    title: "Гарбузовий крем-суп",
    description: "Оксамитовий суп із запеченого гарбуза з вершками.",
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Супи"],
    difficulty: "easy",
    totalTimeMinutes: 50,
    servings: 4,
    ingredients: [
      {
        name: "Гарбуз очищений",
        amount: "700",
        unit: "г",
      },
      {
        name: "Цибуля",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Морква",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Овочевий бульйон",
        amount: "650",
        unit: "мл",
      },
      {
        name: "Вершки 20%",
        amount: "120",
        unit: "мл",
      },
      {
        name: "Оливкова олія",
        amount: "25",
        unit: "мл",
      },
      {
        name: "Сіль",
        amount: "за смаком",
        unit: "",
      },
    ],
    steps: [
      {
        text: "Розігрійте духовку до 200 °C. Наріжте гарбуз, моркву та цибулю.",
        imageUrl: "",
      },
      {
        text: "Змішайте овочі з олією та запікайте 25–30 хвилин до м’якості.",
        imageUrl: "",
      },
      {
        text: "Перекладіть у каструлю, додайте гарячий бульйон і збийте блендером.",
        imageUrl: "",
      },
      {
        text: "Влийте вершки, прогрійте без активного кипіння та відрегулюйте смак.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-05",
    title: "Курка у вершково-грибному соусі",
    description: "Соковите куряче філе з печерицями, часником і вершками.",
    imageUrl:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Основні страви"],
    difficulty: "medium",
    totalTimeMinutes: 40,
    servings: 3,
    ingredients: [
      {
        name: "Куряче філе",
        amount: "550",
        unit: "г",
      },
      {
        name: "Печериці",
        amount: "250",
        unit: "г",
      },
      {
        name: "Вершки 20%",
        amount: "200",
        unit: "мл",
      },
      {
        name: "Цибуля",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Часник",
        amount: "2",
        unit: "зубчики",
      },
      {
        name: "Вершкове масло",
        amount: "25",
        unit: "г",
      },
      {
        name: "Сіль",
        amount: "за смаком",
        unit: "",
      },
    ],
    steps: [
      {
        text: "Наріжте курку великими шматочками та обсушіть.",
        imageUrl: "",
      },
      {
        text: "Обсмажте курку на маслі до золотистості, перекладіть на тарілку.",
        imageUrl: "",
      },
      {
        text: "У тій самій сковороді обсмажте цибулю, печериці та часник.",
        imageUrl: "",
      },
      {
        text: "Поверніть курку, влийте вершки й тушкуйте 10–12 хвилин до повної готовності курки.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-06",
    title: "Різото з грибами",
    description: "Кремове італійське різото з пармезаном та печерицями.",
    imageUrl:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Основні страви"],
    difficulty: "medium",
    totalTimeMinutes: 45,
    servings: 3,
    ingredients: [
      {
        name: "Рис арборіо",
        amount: "240",
        unit: "г",
      },
      {
        name: "Печериці",
        amount: "250",
        unit: "г",
      },
      {
        name: "Гарячий бульйон",
        amount: "850",
        unit: "мл",
      },
      {
        name: "Цибуля",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Вершкове масло",
        amount: "45",
        unit: "г",
      },
      {
        name: "Пармезан",
        amount: "55",
        unit: "г",
      },
      {
        name: "Оливкова олія",
        amount: "15",
        unit: "мл",
      },
    ],
    steps: [
      {
        text: "Обсмажте гриби до рум’яності та відкладіть.",
        imageUrl: "",
      },
      {
        text: "У сотейнику розм’якшіть цибулю на олії з половиною масла.",
        imageUrl: "",
      },
      {
        text: "Додайте рис і прогрійте 2 хвилини, помішуючи.",
        imageUrl: "",
      },
      {
        text: "Поступово вливайте гарячий бульйон порціями, помішуючи, 18–22 хвилини.",
        imageUrl: "",
      },
      {
        text: "Додайте гриби, решту масла та пармезан, перемішайте й подавайте.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-07",
    title: "Картопля по-селянськи",
    description: "Хрусткі часточки картоплі з паприкою та часником.",
    imageUrl:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Гарніри"],
    difficulty: "easy",
    totalTimeMinutes: 45,
    servings: 4,
    ingredients: [
      {
        name: "Картопля",
        amount: "900",
        unit: "г",
      },
      {
        name: "Оливкова олія",
        amount: "35",
        unit: "мл",
      },
      {
        name: "Паприка",
        amount: "2",
        unit: "ч. л.",
      },
      {
        name: "Сушений часник",
        amount: "1",
        unit: "ч. л.",
      },
      {
        name: "Сіль",
        amount: "1",
        unit: "ч. л.",
      },
    ],
    steps: [
      {
        text: "Розігрійте духовку до 210 °C.",
        imageUrl: "",
      },
      {
        text: "Ретельно вимийте картоплю й наріжте часточками.",
        imageUrl: "",
      },
      {
        text: "Обсушіть, змішайте з олією, сіллю та спеціями.",
        imageUrl: "",
      },
      {
        text: "Розкладіть в один шар і запікайте 35–40 хвилин, один раз перевернувши.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-08",
    title: "Соус дзадзикі",
    description: "Освіжальний грецький соус із йогурту, огірка та кропу.",
    imageUrl:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Соуси та заправки"],
    difficulty: "easy",
    totalTimeMinutes: 15,
    servings: 4,
    ingredients: [
      {
        name: "Грецький йогурт",
        amount: "250",
        unit: "г",
      },
      {
        name: "Огірок",
        amount: "150",
        unit: "г",
      },
      {
        name: "Часник",
        amount: "1",
        unit: "зубчик",
      },
      {
        name: "Лимонний сік",
        amount: "12",
        unit: "мл",
      },
      {
        name: "Кріп",
        amount: "10",
        unit: "г",
      },
      {
        name: "Оливкова олія",
        amount: "10",
        unit: "мл",
      },
    ],
    steps: [
      {
        text: "Натріть огірок, посоліть і добре відіжміть зайву рідину.",
        imageUrl: "",
      },
      {
        text: "Подрібніть часник та кріп.",
        imageUrl: "",
      },
      {
        text: "Змішайте йогурт, огірок, часник, кріп, сік лимона та олію.",
        imageUrl: "",
      },
      {
        text: "Охолодіть 10 хвилин перед подачею.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-09",
    title: "Банановий хліб",
    description: "Ароматна волога випічка зі стиглих бананів.",
    imageUrl:
      "https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Випічка"],
    difficulty: "easy",
    totalTimeMinutes: 70,
    servings: 8,
    ingredients: [
      {
        name: "Банани стиглі",
        amount: "300",
        unit: "г",
      },
      {
        name: "Борошно",
        amount: "220",
        unit: "г",
      },
      {
        name: "Яйця",
        amount: "2",
        unit: "шт.",
      },
      {
        name: "Цукор",
        amount: "90",
        unit: "г",
      },
      {
        name: "Вершкове масло",
        amount: "90",
        unit: "г",
      },
      {
        name: "Розпушувач",
        amount: "10",
        unit: "г",
      },
      {
        name: "Кориця",
        amount: "0.5",
        unit: "ч. л.",
      },
    ],
    steps: [
      {
        text: "Розігрійте духовку до 175 °C, підготуйте форму для кексу.",
        imageUrl: "",
      },
      {
        text: "Розімніть банани, змішайте з яйцями, цукром і розтопленим маслом.",
        imageUrl: "",
      },
      {
        text: "Окремо змішайте борошно, розпушувач і корицю.",
        imageUrl: "",
      },
      {
        text: "З’єднайте суміші без надмірного вимішування.",
        imageUrl: "",
      },
      {
        text: "Випікайте 50–60 хвилин до сухої шпажки, охолодіть.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-10",
    title: "Шоколадний брауні",
    description: "Насичений шоколадний десерт із вологою серединкою.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Десерти"],
    difficulty: "medium",
    totalTimeMinutes: 45,
    servings: 9,
    ingredients: [
      {
        name: "Темний шоколад",
        amount: "180",
        unit: "г",
      },
      {
        name: "Вершкове масло",
        amount: "140",
        unit: "г",
      },
      {
        name: "Цукор",
        amount: "170",
        unit: "г",
      },
      {
        name: "Яйця",
        amount: "3",
        unit: "шт.",
      },
      {
        name: "Борошно",
        amount: "95",
        unit: "г",
      },
      {
        name: "Какао",
        amount: "20",
        unit: "г",
      },
    ],
    steps: [
      {
        text: "Розігрійте духовку до 175 °C і вистеліть форму пергаментом.",
        imageUrl: "",
      },
      {
        text: "Розтопіть шоколад із маслом, трохи охолодіть.",
        imageUrl: "",
      },
      {
        text: "Збийте яйця з цукром до однорідності, введіть шоколадну масу.",
        imageUrl: "",
      },
      {
        text: "Обережно вмішайте борошно й какао.",
        imageUrl: "",
      },
      {
        text: "Випікайте 23–28 хвилин, охолодіть перед нарізанням.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-11",
    title: "Ягідний смузі",
    description: "Густий фруктово-ягідний напій із йогуртом.",
    imageUrl:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Напої"],
    difficulty: "easy",
    totalTimeMinutes: 10,
    servings: 2,
    ingredients: [
      {
        name: "Полуниця",
        amount: "150",
        unit: "г",
      },
      {
        name: "Банан",
        amount: "1",
        unit: "шт.",
      },
      {
        name: "Чорниця",
        amount: "100",
        unit: "г",
      },
      {
        name: "Натуральний йогурт",
        amount: "200",
        unit: "г",
      },
      {
        name: "Мед",
        amount: "10",
        unit: "г",
      },
    ],
    steps: [
      {
        text: "Помийте ягоди та очистьте банан.",
        imageUrl: "",
      },
      {
        text: "Покладіть усі інгредієнти в чашу блендера.",
        imageUrl: "",
      },
      {
        text: "Збийте до однорідної консистенції, за потреби додайте трохи води.",
        imageUrl: "",
      },
      {
        text: "Подавайте відразу після приготування.",
        imageUrl: "",
      },
    ],
  },
  {
    id: "lemonsqueezy-demo-12",
    title: "Домашня фокача з розмарином",
    description: "Повітряний італійський хліб з оливковою олією.",
    imageUrl:
      "https://images.unsplash.com/photo-1619531040576-f9416740661b?auto=format&fit=crop&w=1200&q=85",
    categoryIds: ["Хліб і тісто"],
    difficulty: "medium",
    totalTimeMinutes: 160,
    servings: 8,
    ingredients: [
      {
        name: "Борошно пшеничне",
        amount: "450",
        unit: "г",
      },
      {
        name: "Вода",
        amount: "340",
        unit: "мл",
      },
      {
        name: "Сухі дріжджі",
        amount: "6",
        unit: "г",
      },
      {
        name: "Сіль",
        amount: "9",
        unit: "г",
      },
      {
        name: "Оливкова олія",
        amount: "55",
        unit: "мл",
      },
      {
        name: "Розмарин",
        amount: "2",
        unit: "г",
      },
    ],
    steps: [
      {
        text: "Змішайте воду, дріжджі, борошно та сіль, замісіть липке тісто.",
        imageUrl: "",
      },
      {
        text: "Накрийте й залиште на 60–90 хвилин до збільшення об’єму.",
        imageUrl: "",
      },
      {
        text: "Перекладіть у змащену форму, розтягніть і залиште ще на 30 хвилин.",
        imageUrl: "",
      },
      {
        text: "Зробіть пальцями заглиблення, полийте олією, посипте розмарином.",
        imageUrl: "",
      },
      {
        text: "Випікайте при 220 °C приблизно 20–25 хвилин до золотистості.",
        imageUrl: "",
      },
    ],
  },
];
