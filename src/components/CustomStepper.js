import {
  Box,
  Button,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import { useState } from 'react'

const steps = [
  {
    label: 'Search posts by tag name',
    description: `If you want to search for posts by tag name, then just start 
              typing starting with the # symbol.`
  },
  {
    label: 'Search users by first name, last name or nickname',
    description: `If you want to search for users by user information, then just start 
              typing starting with name, last name or nickname.`
  },
  {
    label: 'Find new friends',
    description: `To find new relationships and friends just focus 
              the search field and press Enter or search button.`
  }
]

const CustomStepper = () => {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent TransitionProps={{ unmountOnExit: false }}>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

export default CustomStepper
