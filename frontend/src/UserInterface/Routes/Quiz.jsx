import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Quiz = () => {
  const { t } = useTranslation();
  // List of questions with options and the correct answer
  const questions = [
    {
      question: t('quiz.q1'),
      options: ["Basil", "Lavender", "Mint", "Rosemary"],
      answer: "Lavender"
    },
    {
      question: t('quiz.q2'),
      options: ["Chamomile", "Echinacea", "Basil", "Ginger"],
      answer: "Ginger"
    },
    {
      question: t('quiz.q3'),
      options: ["Peppermint", "Garlic", "Thyme", "Sage"],
      answer: "Garlic"
    },
    {
      question: t('quiz.q4'),
      options: ["Lemon Balm", "Turmeric", "Ashwagandha", "Oregano"],
      answer: "Lemon Balm"
    },
    {
      question: t('quiz.q5'),
      options: ["Aloe Vera", "Basil", "Mint", "Thyme"],
      answer: "Aloe Vera"
    }
  ];

  // State hooks to manage the quiz state
  const [quizStarted, setQuizStarted] = useState(false); // Tracks if the quiz has started
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question index
  const [selectedAnswer, setSelectedAnswer] = useState(''); // Tracks the selected answer for the current question
  const [score, setScore] = useState(0); // Tracks the score based on correct answers
  const [quizCompleted, setQuizCompleted] = useState(false); // Tracks whether the quiz is completed or not

  // Function to handle the answer selection
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer); // Set the selected answer
  };

  // Function to handle moving to the next question or completing the quiz
  const handleNextQuestion = () => {
    // Check if the selected answer is correct, and update the score
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1); // Increase score if correct answer is selected
    }

    // Move to the next question if available, otherwise complete the quiz
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Increment question index
      setSelectedAnswer(''); // Reset selected answer for the next question
    } else {
      setQuizCompleted(true); // Mark the quiz as completed when all questions are answered
    }
  };

  // Function to determine the button class based on the selected answer
  const getButtonClass = (option) => {
    if (!selectedAnswer) return 'border-gray-300 dark:border-gray-600'; // Default border if no answer is selected

    // If the option is the selected answer, check if it's correct or wrong
    if (option === selectedAnswer) {
      return option === questions[currentQuestionIndex].answer
        ? 'border-green-500 bg-green-50 dark:bg-green-900/40' // Correct answer (green border)
        : 'border-red-500 bg-red-50 dark:bg-red-900/40'; // Wrong answer (red border)
    }

    // If the option is the correct answer, always display it with a green border
    if (option === questions[currentQuestionIndex].answer) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/40'; // Correct answer (green border)
    }

    return 'border-gray-300 dark:border-gray-600'; // Default border for unselected options
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] py-12 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400">{t('quiz.title')}</h1>
          <p className="mt-4 text-lg text-[#50B250] dark:text-green-300">
            {t('quiz.subtitle')}
          </p>
        </div>

        {/* Show "Start Quiz" button before the quiz begins */}
        {!quizStarted && !quizCompleted && (
          <div className="text-center">
            <button
              onClick={() => setQuizStarted(true)} // Start the quiz when clicked
              className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
            >
              {t('quiz.start')}
            </button>
          </div>
        )}

        {/* Quiz questions and options */}
        {quizStarted && !quizCompleted ? (
          <div className="bg-white dark:bg-[#0F1720] p-6 sm:p-8 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-800 dark:text-green-400 mb-4">
              {t('quiz.questionLabel', { current: currentQuestionIndex + 1 })} {questions[currentQuestionIndex].question}
            </h2>

            {/* Display options for the current question */}
            <div className="space-y-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelection(option)} // Select answer when clicked
                  className={`w-full py-3 px-4 rounded-lg text-left border-2 ${getButtonClass(option)} text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30`}
                  disabled={selectedAnswer} // Disable all buttons after an answer is selected
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Next question button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleNextQuestion} // Move to the next question or complete the quiz
                disabled={!selectedAnswer} // Disable the button until an answer is selected
                className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700"
              >
                {currentQuestionIndex + 1 < questions.length ? t('quiz.next') : t('quiz.finish')}
              </button>
            </div>
          </div>
        ) : quizCompleted ? (
          // Display results after completing the quiz
          <div className="bg-white dark:bg-[#0F1720] p-6 sm:p-8 rounded-lg shadow-lg text-center border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-800 dark:text-green-400 mb-4">{t('quiz.completed')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">{t('quiz.score', { score, total: questions.length })}</p>
            <button
              onClick={() => {
                setCurrentQuestionIndex(0); // Reset to the first question
                setScore(0); // Reset the score
                setQuizCompleted(false); // Reset the quiz completion status
                setQuizStarted(false); // Reset quiz started status
              }}
              className="mt-6 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
            >
              {t('quiz.restart')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quiz;
