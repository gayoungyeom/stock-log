import { Button, Dialog, Input, Label } from "@components/ui"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { PERCENTAGES_BY_STEP } from "@lib/static"
import { GearIcon } from "@radix-ui/react-icons"
import { useState } from "react"

interface IPercentageSettingProps {
  saveHandler: ({ start, end, step }: { start: number; end: number; step: number }) => void
}

const PercentageSetting = ({ saveHandler }: IPercentageSettingProps) => {
  const [percentSetting, setPercentSetting] = useState(PERCENTAGES_BY_STEP["2.5"])

  const PercentageForm = ({ label, value }: { label: string; value: number }) => {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="start" className="text-left">
          {label}
        </Label>
        <Input
          className="col-span-3"
          type="number"
          step="0.01"
          placeholder={label}
          id={label}
          value={value}
          onChange={(e) =>
            setPercentSetting((prev) => ({ ...prev, [label]: Number(e.target.value) }))
          }
        />
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <GearIcon className="cursor-pointer" width={"20px"} height={"20px"} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setting</DialogTitle>
          <DialogDescription>Make changes to your percentages here.</DialogDescription>
        </DialogHeader>

        <div className="space-x-2">
          {Object.keys(PERCENTAGES_BY_STEP).map((step) => (
            <Button
              key={step}
              size="sm"
              variant="secondary"
              onClick={() => setPercentSetting({ ...PERCENTAGES_BY_STEP[step as "2.5" | "5.0"] })}
            >
              {step}%
            </Button>
          ))}
        </div>

        <div className="grid gap-4 py-4">
          <PercentageForm label="start" value={percentSetting.start} />
          <PercentageForm label="end" value={percentSetting.end} />
          <PercentageForm label="step" value={percentSetting.step} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => saveHandler(percentSetting)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PercentageSetting
