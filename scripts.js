document.addEventListener("DOMContentLoaded", () => {
    // ========= Получаем экраны =========
    const screenChooseScript = document.getElementById("screen-choose-script");
    const screenChooseMode   = document.getElementById("screen-choose-mode");
    const quizScreen         = document.getElementById("quiz-screen");
    const resultScreen       = document.getElementById("result-screen");
  
    // ========= Кнопки / плитки на экранах 1 и 2 =========
    const katakanaTile       = document.getElementById("katakana-tile");
    const hiraganaTile       = document.getElementById("hiragana-tile");
    const backToScriptButton = document.getElementById("back-to-script");
    const learnTile          = document.getElementById("learn-tile");
    const testTile           = document.getElementById("test-tile");
  
    // ========= Кнопки / элементы Quiz-экрана =========
    const homeButton         = document.getElementById("home-button");
    const refreshButton      = document.getElementById("refresh-button");
    const quizTitle          = document.getElementById("quiz-title");
    const modeIndicator      = document.getElementById("mode-indicator");
    const correctCountElem   = document.getElementById("correctCount");
    const wrongCountElem     = document.getElementById("wrongCount");
    const questionElem       = document.getElementById("question");
    const optionButtons      = Array.from(document.querySelectorAll(".option"));
  
    // ========= Кнопки / элементы экрана результатов =========
    const restartButton      = document.getElementById("restart-button");
    const resultStatsElem    = document.getElementById("result-stats");
    const resultGradeElem    = document.getElementById("result-grade");
  
    // ========= Внутренние переменные квиза =========
    let selectedScript   = "";      // "Katakana" / "Hiragana"
    let currentMode      = "";      // "learn" / "test"
    let currentSet       = [];      // массив объектов {romaji, kana} для выбранного алфавита
    let remainingSymbols = [];      // то, что осталось в режиме "test"
    let correctCount     = 0;
    let wrongCount       = 0;
  
    // ========= Массивы символов =========
    // Полный набор катаканы (46 символов)
    const katakana = [
      { romaji: "a", kana: "ア" }, { romaji: "i", kana: "イ" }, { romaji: "u", kana: "ウ" },
      { romaji: "e", kana: "エ" }, { romaji: "o", kana: "オ" },
      { romaji: "ka", kana: "カ" }, { romaji: "ki", kana: "キ" }, { romaji: "ku", kana: "ク" },
      { romaji: "ke", kana: "ケ" }, { romaji: "ko", kana: "コ" },
      { romaji: "sa", kana: "サ" }, { romaji: "shi", kana: "シ" }, { romaji: "su", kana: "ス" },
      { romaji: "se", kana: "セ" }, { romaji: "so", kana: "ソ" },
      { romaji: "ta", kana: "タ" }, { romaji: "chi", kana: "チ" }, { romaji: "tsu", kana: "ツ" },
      { romaji: "te", kana: "テ" }, { romaji: "to", kana: "ト" },
      { romaji: "na", kana: "ナ" }, { romaji: "ni", kana: "ニ" }, { romaji: "nu", kana: "ヌ" },
      { romaji: "ne", kana: "ネ" }, { romaji: "no", kana: "ノ" },
      { romaji: "ha", kana: "ハ" }, { romaji: "hi", kana: "ヒ" }, { romaji: "fu", kana: "フ" },
      { romaji: "he", kana: "ヘ" }, { romaji: "ho", kana: "ホ" },
      { romaji: "ma", kana: "マ" }, { romaji: "mi", kana: "ミ" }, { romaji: "mu", kana: "ム" },
      { romaji: "me", kana: "メ" }, { romaji: "mo", kana: "モ" },
      { romaji: "ya", kana: "ヤ" }, { romaji: "yu", kana: "ユ" }, { romaji: "yo", kana: "ヨ" },
      { romaji: "ra", kana: "ラ" }, { romaji: "ri", kana: "リ" }, { romaji: "ru", kana: "ル" },
      { romaji: "re", kana: "レ" }, { romaji: "ro", kana: "ロ" },
      { romaji: "wa", kana: "ワ" }, { romaji: "wo", kana: "ヲ" },
      { romaji: "n", kana: "ン" }
    ];
  
    // Полный набор хираганы (46 символов)
    const hiragana = [
      { romaji: "a", kana: "あ" }, { romaji: "i", kana: "い" }, { romaji: "u", kana: "う" },
      { romaji: "e", kana: "え" }, { romaji: "o", kana: "お" },
      { romaji: "ka", kana: "か" }, { romaji: "ki", kana: "き" }, { romaji: "ku", kana: "く" },
      { romaji: "ke", kana: "け" }, { romaji: "ko", kana: "こ" },
      { romaji: "sa", kana: "さ" }, { romaji: "shi", kana: "し" }, { romaji: "su", kana: "す" },
      { romaji: "se", kana: "せ" }, { romaji: "so", kana: "そ" },
      { romaji: "ta", kana: "た" }, { romaji: "chi", kana: "ち" }, { romaji: "tsu", kana: "つ" },
      { romaji: "te", kana: "て" }, { romaji: "to", kana: "と" },
      { romaji: "na", kana: "な" }, { romaji: "ni", kana: "に" }, { romaji: "nu", kana: "ぬ" },
      { romaji: "ne", kana: "ね" }, { romaji: "no", kana: "の" },
      { romaji: "ha", kana: "は" }, { romaji: "hi", kana: "ひ" }, { romaji: "fu", kana: "ふ" },
      { romaji: "he", kana: "へ" }, { romaji: "ho", kana: "ほ" },
      { romaji: "ma", kana: "ま" }, { romaji: "mi", kana: "み" }, { romaji: "mu", kana: "む" },
      { romaji: "me", kana: "め" }, { romaji: "mo", kana: "も" },
      { romaji: "ya", kana: "や" }, { romaji: "yu", kana: "ゆ" }, { romaji: "yo", kana: "よ" },
      { romaji: "ra", kana: "ら" }, { romaji: "ri", kana: "り" }, { romaji: "ru", kana: "る" },
      { romaji: "re", kana: "れ" }, { romaji: "ro", kana: "ろ" },
      { romaji: "wa", kana: "わ" }, { romaji: "wo", kana: "を" },
      { romaji: "n", kana: "ん" }
    ];
  
    // ========= Функция переключения экранов =========
    function showScreen(screen) {
      // Сначала скрываем все
      [screenChooseScript, screenChooseMode, quizScreen, resultScreen].forEach(s => {
        s.classList.remove("active");
        s.classList.add("hidden");
      });
      // Показываем нужный
      screen.classList.remove("hidden");
      screen.classList.add("active");
    }
  
    // ========= Логика экрана 1 (выбор алфавита) =========
    katakanaTile.addEventListener("click", () => {
      selectedScript = "Katakana";
      showScreen(screenChooseMode);
    });
  
    hiraganaTile.addEventListener("click", () => {
      selectedScript = "Hiragana";
      showScreen(screenChooseMode);
    });
  
    // ========= Логика экрана 2 (выбор режима) =========
    backToScriptButton.addEventListener("click", () => {
      showScreen(screenChooseScript);
    });
  
    learnTile.addEventListener("click", () => {
      currentMode = "learn";
      startQuiz();
    });
  
    testTile.addEventListener("click", () => {
      currentMode = "test";
      startQuiz();
    });
  
    // ========= Функция для запуска квиза =========
    function startQuiz() {
      // 1. Определяем массив символов
      currentSet = (selectedScript === "Katakana") ? katakana : hiragana;
  
      // 2. Сбрасываем счётчики
      correctCount = 0;
      wrongCount   = 0;
      correctCountElem.textContent = 0;
      wrongCountElem.textContent   = 0;
  
      // 3. Если режим Test — берём копию массива (символы не повторяются).
      //    Если Learn — просто используем случайный символ из полного массива.
      if (currentMode === "test") {
        remainingSymbols = [...currentSet];
      } else {
        remainingSymbols = [];
      }
  
      // 4. Обновляем заголовки
      quizTitle.textContent     = `${selectedScript} Quiz`;
      modeIndicator.textContent = `Mode: ${currentMode === "learn" ? "Infinite Learn" : "Test Knowledge"}`;

      // 5. Показываем/скрываем кнопку Refresh
      if (currentMode === "test") {
        refreshButton.style.display = "none";  // скрыть
      } else {
        refreshButton.style.display = "inline-block"; // показать
      }
  
      // 6. Переходим на экран Quiz
      showScreen(quizScreen);
  
      // 7. Показываем первый (или очередной) вопрос
      setQuestion();
    }
  
    // ========= Генерация одного вопроса =========
    function setQuestion() {
      // Если режим Test и символы закончились — показать результат
      if (currentMode === "test" && remainingSymbols.length === 0) {
        showResults();
        return;
      }
  
      let correctSymbol;
      if (currentMode === "test") {
        // Берём случайный индекс из remainingSymbols
        const randIndex = Math.floor(Math.random() * remainingSymbols.length);
        correctSymbol   = remainingSymbols.splice(randIndex, 1)[0];
      } else {
        // Режим Learn: берём случайный из всего currentSet (не удаляем)
        correctSymbol = currentSet[Math.floor(Math.random() * currentSet.length)];
      }
  
      // Генерируем 3 неправильных ответа
      const wrongOptions = getRandomWrongOptions(correctSymbol);
  
      // Склеиваем correct + 3 wrong => тасуем
      const allOptions = shuffleArray([correctSymbol, ...wrongOptions]);
  
      // Заполняем вопрос
      questionElem.textContent = correctSymbol.kana;
  
      // Привязываем ответы к кнопкам
      optionButtons.forEach((btn, index) => {
        const optionData = allOptions[index];
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
        btn.textContent = optionData.romaji;
  
        // При клике
        btn.onclick = () => {
            disableAllOptions();
          
            if (optionData === correctSymbol) {
              btn.classList.add("correct");
              correctCount++;
            } else {
              btn.classList.add("wrong");
              wrongCount++;
              
              // Если режим learn — подсветим правильный вариант
              if (currentMode === "learn") {
                // Найдём индекс правильного варианта в allOptions
                const correctIndex = allOptions.findIndex(opt => opt === correctSymbol);
                // Подсветим кнопку, соответствующую правильному ответу
                optionButtons[correctIndex].classList.add("correct");
              }
            }
          
            correctCountElem.textContent = correctCount;
            wrongCountElem.textContent   = wrongCount;
          
            setTimeout(() => {
              setQuestion();
            }, 1000);
          };          
      });
    }
  
    // ========= Функция получения 3 неправильных вариантов =========
    function getRandomWrongOptions(correctSymbol) {
        // Фильтруем массив, исключая правильный символ
        let filtered = currentSet.filter(s => s !== correctSymbol);
        
        // Перетасуем и сохраним результат
        filtered = shuffleArray(filtered);
      
        // Теперь берём первые 3 элемента из уже перемешанного
        return filtered.slice(0, 3);
      }
      
  
    // ========= Функция для случайного перемешивания массива =========
    function shuffleArray(array) {
      let arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  
    // ========= Отключить все кнопки-ответы =========
    function disableAllOptions() {
      optionButtons.forEach(btn => {
        btn.disabled = true;
      });
    }
  
    // ========= Показать экран результатов =========
    function showResults() {
      showScreen(resultScreen);
  
      const total = correctCount + wrongCount;
      const score = (total > 0) ? Math.round((correctCount / total) * 100) : 0;
  
      let grade;
      if      (score >= 90) grade = "S";
      else if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B";
      else if (score >= 50) grade = "C";
      else                  grade = "D";
  
      resultStatsElem.textContent = `This session: ${correctCount} / ${total} (${score}%)`;
      resultGradeElem.textContent = `Grade: ${grade}`;
    }

    refreshButton.addEventListener("click", () => {
        if (currentMode === "learn") {
          // Сброс счетчиков
          correctCount = 0;
          wrongCount   = 0;
          correctCountElem.textContent = 0;
          wrongCountElem.textContent   = 0;
          
          // Можно заново сгенерировать вопрос
          setQuestion();
        }
      });
      
  
    // ========= Логика кнопок «Home» / «Restart» =========
    homeButton.addEventListener("click", () => {
      // Нажали «Home» — вернёмся на первый экран (полный сброс)
      showScreen(screenChooseMode);
    });
  
    restartButton.addEventListener("click", () => {
      // Нажали «Home» в результатах — вернёмся на первый экран
      showScreen(screenChooseScript);
    });
  
    // ========= Изначально показываем экран 1 (выбор алфавита) =========
    showScreen(screenChooseScript);
  });
  