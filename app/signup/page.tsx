import SignUpForm from "./signup-form"
import { Suspense } from "react"

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  )
}
