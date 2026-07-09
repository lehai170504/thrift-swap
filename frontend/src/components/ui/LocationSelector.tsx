import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Province { code: number; name: string; }
interface District { code: number; name: string; province_code: number; }
interface Ward { code: number; name: string; district_code: number; }

interface LocationSelectorProps {
  value?: string;
  onChange: (location: string) => void;
  mode?: 'full' | 'province';
  className?: string;
}

export function LocationSelector({ value, onChange, mode = 'full', className }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProv, setSelectedProv] = useState<Province | null>(null);
  const [selectedDist, setSelectedDist] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  const handleProvinceChange = (codeStr: string | null) => {
    if (!codeStr) {
      onChange('');
      setSelectedProv(null);
      setSelectedDist(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);
      return;
    }
    const code = parseInt(codeStr);
    const prov = provinces.find(p => p.code === code) || null;
    setSelectedProv(prov);
    setSelectedDist(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);

    onChange(prov ? prov.name : '');

    if (prov && mode === 'full') {
      fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts))
        .catch(err => console.error(err));
    }
  };

  const handleDistrictChange = (codeStr: string | null) => {
    if (!codeStr) {
      setSelectedDist(null);
      setSelectedWard(null);
      setWards([]);
      if (selectedProv) {
        onChange(selectedProv.name);
      } else {
        onChange('');
      }
      return;
    }
    const code = parseInt(codeStr);
    const dist = districts.find(d => d.code === code) || null;
    setSelectedDist(dist);
    setSelectedWard(null);
    setWards([]);

    if (dist && selectedProv) {
      onChange(`${dist.name}, ${selectedProv.name}`);
    } else if (selectedProv) {
      onChange(selectedProv.name);
    } else {
      onChange('');
    }

    if (dist) {
      fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards))
        .catch(err => console.error(err));
    }
  };

  const handleWardChange = (codeStr: string | null) => {
    if (!codeStr) {
      setSelectedWard(null);
      if (selectedDist && selectedProv) {
        onChange(`${selectedDist.name}, ${selectedProv.name}`);
      } else if (selectedProv) {
        onChange(selectedProv.name);
      } else {
        onChange('');
      }
      return;
    }
    const code = parseInt(codeStr);
    const ward = wards.find(w => w.code === code) || null;
    setSelectedWard(ward);
    if (ward && selectedDist && selectedProv) {
      onChange(`${ward.name}, ${selectedDist.name}, ${selectedProv.name}`);
    } else {
      onChange('');
    }
  };

  // Note: we don't parse `value` back to selected states because it's a one-way binding 
  // for simplicity. If a user edits, they will have to select from province again.
  // We just show a placeholder if no province is selected, or use the incoming value.

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="space-y-2">
        <Label>Tỉnh / Thành phố</Label>
        <Select value={selectedProv ? selectedProv.code.toString() : ''} onValueChange={handleProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder={value && !selectedProv ? value.split(',').pop()?.trim() || "Chọn Tỉnh / Thành phố" : "Chọn Tỉnh / Thành phố"}>
              {selectedProv ? selectedProv.name : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {provinces.map(p => (
              <SelectItem key={p.code} value={p.code.toString()}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {mode === 'full' && (
        <>
          <div className="space-y-2">
            <Label>Quận / Huyện</Label>
            <Select disabled={!selectedProv} value={selectedDist ? selectedDist.code.toString() : ''} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn Quận / Huyện">
                  {selectedDist ? selectedDist.name : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => (
                  <SelectItem key={d.code} value={d.code.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Phường / Xã</Label>
            <Select disabled={!selectedDist} value={selectedWard ? selectedWard.code.toString() : ''} onValueChange={handleWardChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường / Xã">
                  {selectedWard ? selectedWard.name : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {wards.map(w => (
                  <SelectItem key={w.code} value={w.code.toString()}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
