import SignInForm from "./signin-form"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
