import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import CircularProgressBar from '../../components/widgets/CircularProgressbar';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/types';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

const MbtiQuiz: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'MbtiQuiz'>;
}> = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'How do you recharge your energy?',
      options: [
        {
          id: '01',
          text: 'By being around people, engaging in conversations, & participating in activities.',
        },
        {
          id: '02',
          text: 'By spending time alone, reflecting, & engaging in quiet activities.',
        },
      ],
    },
    {
      id: 2,
      question: 'How do you usually take a bath?',
      options: [
        {
          id: '01',
          text: 'By being around people, engaging in conversations, & participating in activities.',
        },
        {
          id: '02',
          text: 'By spending time alone, reflecting, & engaging in quiet activities.',
        },
      ],
    },
  ];

  const currentQuestionData = quizQuestions[currentQuestion];
  const totalQuestions = quizQuestions.length;

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      // Save the answer
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: selectedAnswer,
      }));

      if (currentQuestion < totalQuestions - 1) {
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        console.log('Quiz completed:', {
          ...answers,
          [currentQuestion]: selectedAnswer,
        });
        // Navigate to results or next screen
        navigation.push('Tabs');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      // Load previous answer if exists
      const prevAnswer = answers[currentQuestion - 1];
      setSelectedAnswer(prevAnswer || null);
    }
  };

  const handleSkip = () => {
    // Handle skip logic
    console.log('Skipped question');
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.title}>MBTI Quiz</Text>
      <Text style={styles.subtitle}>
        Before we start, let's find out your MBTI Profile.
      </Text>

      {/* Question Number Circle */}
      <CircularProgressBar
        textStyle={{ fontSize: 20 }}
        progress={(currentQuestion + 1 / totalQuestions) * 100}
        text={
          (currentQuestion < 9 ? '0' : '') + (currentQuestion + 1).toString()
        }
      />

      {/* Question */}
      <Text style={styles.question}>{currentQuestionData.question}</Text>

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Choose your answer</Text>

        {currentQuestionData.options.map(option => (
          <Pressable
            key={option.id}
            style={[
              styles.optionButton,
              selectedAnswer === option.id && styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(option.id)}>
            <View style={styles.optionContent}>
              <Text style={styles.optionId}>{option.id}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
              <View style={styles.radioButton}>
                {selectedAnswer === option.id ? (
                  <View style={styles.radioButtonSelected} />
                ) : (
                  <View style={styles.radioButtonUnselected} />
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          style={
            [
              styles.nextButton,
              !selectedAnswer ? styles.disabledButton : {},
            ] as any
          }
          disabled={!selectedAnswer}
        />

        {currentQuestion > 0 && (
          <AppButton
            title="Previous"
            onPress={handlePrevious}
            style={styles.previousButton}
            variant="outline"
          />
        )}

        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 32,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  questionNumberContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  questionNumberCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D4A574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 18,
    color: '#D4A574',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    color: '#D4A574',
    marginBottom: 32,
    marginTop: 30,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  optionsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  selectedOption: {
    borderColor: '#D4A574',
    backgroundColor: '#FFF9F3',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
    minWidth: 24,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  radioButton: {
    marginLeft: 12,
    marginTop: 2,
  },
  radioButtonSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  radioButtonUnselected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCC',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#D4A574',
  },
  disabledButton: {
    opacity: 0.5,
  },
  previousButton: {
    width: '100%',
    borderColor: '#D4A574',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
});

export default MbtiQuiz;
