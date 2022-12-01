import { useWebRTC } from '@signalwire-community/react';
import {
  CameraVideoFill,
  CameraVideoOffFill,
  MicFill,
  MicMuteFill,
  VolumeMuteFill,
  VolumeUpFill,
} from 'react-bootstrap-icons';
import SingleControlButton from './SingleControlButton';

type ISize = 'sm' | 'md' | 'lg';

export default function Controls({
  control,
  self = false,
  disabled = true,
}: {
  self: boolean;
  disabled: boolean;
  control: any;
}) {
  const { cameras, microphones, speakers } = useWebRTC();
  return (
    <>
      {[
        {
          name: 'camera',
          enabledIcon: () => <CameraVideoFill />,
          disabledIcon: () => <CameraVideoOffFill />,
          toggledOn: !control?.video?.muted,
          onClick(e: any) {
            e.stopPropagation();
            control.video.toggle();
          },

          // only for self
          items: self ? cameras : undefined,
          onSelect(x: MediaDeviceInfo) {
            control.video.setDevice(x);
          },
          size: self ? ('md' as ISize) : ('sm' as ISize),
        },
        {
          name: 'microphone',
          enabledIcon: () => <MicFill />,
          disabledIcon: () => <MicMuteFill />,
          toggledOn: !control?.audio?.muted,
          onClick(e: any) {
            e.stopPropagation();
            control.audio.toggle();
          },

          // only for self
          items: self ? microphones : undefined,
          onSelect(x: MediaDeviceInfo) {
            control.audio.setDevice(x);
          },
          size: self ? ('md' as ISize) : ('sm' as ISize),
        },
        {
          name: 'speakers',
          enabledIcon: () => <VolumeUpFill />,
          disabledIcon: () => <VolumeMuteFill />,
          toggledOn: !control?.speaker?.muted,
          onClick(e: any) {
            e.stopPropagation();
            control.speaker.toggle();
          },

          // only for self
          items: self ? speakers : undefined,
          onSelect(x: MediaDeviceInfo) {
            control.speaker.setDevice(x);
          },
          size: self ? ('md' as ISize) : ('sm' as ISize),
        },
      ].map(({ name, ...props }) => (
        <SingleControlButton {...props} key={name} disabled={disabled} />
      ))}
    </>
  );
}
