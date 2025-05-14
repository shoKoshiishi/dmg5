import React, { useState } from 'react';
import './App.css'; // Import styles or use CSS modules

type SharpnessColor = 'yellow' | 'green' | 'blue' | 'white';

interface Hitzone {
  name: string;
  raw: number;
  elem: number;
}

const skillCategories = {
  weaponSkills: [
    { id: 'attack', name: '攻撃', levels: 7 },
    { id: 'criticalEye', name: '見切り', levels: 7 },
    { id: 'critBoost', name: '超会心', levels: 5 },
    { id: 'mindsEye', name: '心眼', levels: 3 },
    { id: 'critElem', name: '会心撃【属性】', levels: 5 },
  ],
  armorSkills: [
    { id: 'peakPerformance', name: 'フルチャージ', levels: 5 },
    { id: 'inverse', name: '逆襲', levels: 3 },
    { id: 'agitator', name: '挑戦者', levels: 5 },
    { id: 'maximumMight', name: '渾身', levels: 3 },
    { id: 'latentPower', name: '力の解放', levels: 5 },
    { id: 'chainCrit', name: '連撃', levels: 3 },
    { id: 'offensiveGuard', name: '巧撃', levels: 3 },
    { id: 'absorption', name: '属性吸収', levels: 3 },
    { id: 'weaknessExploit', name: '弱点特攻', levels: 5 },
  ],
  seriesSkills: [
    { id: 'nushiNoTamashii', name: 'ヌシの魂', levels: 1 },
  ],
};

const motionCategories = {
  basicAttacks: [
    { id: 'verticalSlash', name: '縦斬り', mv: 0.24, hits: 1 },
    { id: 'verticalSlash2', name: '縦斬り(2)', mv: 0.18, hits: 1 },
    { id: 'reverseSlash', name: '逆袈裟斬り', mv: 0.32, hits: 1 },
    { id: 'thrust', name: '突き', mv: 0.18, hits: 1 },
    { id: 'slashUp', name: '斬り上げ', mv: 0.18, hits: 1 },
    { id: 'slashBack', name: '斬り下がり', mv: 0.22, hits: 1 },
    { id: 'sideSlash', name: '左右移動斬り', mv: 0.22, hits: 1 },
    { id: 'spiritSlash1', name: '気刃斬りI', mv: 0.26, hits: 1 },
    { id: 'redBladeSlash1', name: '赤刃斬りI', mv: 0.30, hits: 1 },
  ],
  spiritCombos: [
    { id: 'spiritStepSlash', name: '気刃踏み込み斬り', mv: 0.28, hits: 1 },
    { id: 'spiritSlash1NoGauge', name: '気刃斬りⅠ(ゲージ無し)', mv: 0.14, hits: 1 },
    { id: 'spiritSlash1', name: '気刃斬りⅠ', mv: 0.31, hits: 1 },
    { id: 'spiritSlash2', name: '気刃斬りⅡ', mv: 0.30, hits: 1 },
    { id: 'spiritSlash2Move1', name: '気刃斬りⅡ(移動) ヒット1', mv: 0.14, hits: 1 },
    { id: 'spiritSlash2Move2', name: '気刃斬りⅡ(移動) ヒット2', mv: 0.26, hits: 1 },
    { id: 'spiritSlash3Hit1', name: '気刃斬りⅢ ヒット1', mv: 0.14, hits: 1 },
    { id: 'spiritSlash3Hit2', name: '気刃斬りⅢ ヒット2', mv: 0.19, hits: 1 },
    { id: 'spiritSlash3Hit3', name: '気刃斬りⅢ ヒット3', mv: 0.34, hits: 1 },
    { id: 'spiritRoundSlash', name: '気刃大回転斬り', mv: 0.38, hits: 1 },
  ],
  iaiAndRedBlade: [
    { id: 'iaiDrawSlash1', name: '居合抜刀斬り ヒット1', mv: 0.18, hits: 1 },
    { id: 'iaiDrawSlash2', name: '居合抜刀斬り ヒット2', mv: 0.13, hits: 1 },
    { id: 'iaiSpiritSlashNoGauge', name: '居合抜刀気刃斬り (ゲージ無し?)', mv: 0.17, hits: 1 },
    { id: 'iaiSpiritSlashWhite', name: '居合抜刀気刃斬り白', mv: 0.19, hits: 1 },
    { id: 'iaiSpiritSlashYellow', name: '居合抜刀気刃斬り黄', mv: 0.31, hits: 1 },
    { id: 'iaiSpiritSlashRed', name: '居合抜刀気刃斬り赤', mv: 0.39, hits: 1 },
    { id: 'foresightSlash', name: '見切り斬り', mv: 0.11, hits: 1 },
    { id: 'foresightSlashSpin1', name: '見切り斬り・旋 ヒット1', mv: 0.20, hits: 1 },
    { id: 'foresightSlashSpin2', name: '見切り斬り・旋 ヒット2', mv: 0.12, hits: 1 },
    { id: 'redBladeSlash2Hit1', name: '赤刃斬りⅡ ヒット1', mv: 0.09, hits: 1 },
    { id: 'redBladeSlash2Hit2', name: '赤刃斬りⅡ ヒット2', mv: 0.18, hits: 1 },
    { id: 'redBladeSlash3Hit1', name: '赤刃斬りⅢ ヒット1', mv: 0.28, hits: 1 },
    { id: 'redBladeSlash3Hit2', name: '赤刃斬りⅢ ヒット2', mv: 0.16, hits: 1 },
    { id: 'redBladeSlash3Hit3', name: '赤刃斬りⅢ ヒット3', mv: 0.49, hits: 1 },
    { id: 'redBladeSpinSlash', name: '赤刃旋転斬', mv: 0.55, hits: 1 },
  ],
  specialAttacks: [
    { id: 'spiritRelease5', name: '練気解放無双斬り MV5', mv: 0.05, hits: 3 },
    { id: 'spiritRelease10', name: '練気解放無双斬り MV10', mv: 0.10, hits: 3 },
    { id: 'spiritRelease16', name: '練気解放無双斬り MV16', mv: 0.16, hits: 3 },
    { id: 'spiritRelease22', name: '練気解放無双斬り MV22', mv: 0.22, hits: 3 },
    { id: 'spiritRelease36', name: '練気解放無双斬り MV36', mv: 0.36, hits: 3 },
    { id: 'spiritHelmBreakerWhite', name: '気刃兜割 白', mv: 0.15, hits: 7 },
    { id: 'spiritHelmBreakerYellow', name: '気刃兜割 黄', mv: 0.20, hits: 7 },
    { id: 'spiritHelmBreakerRed', name: '気刃兜割 赤', mv: 0.23, hits: 7 },
    { id: 'spiritThrust', name: '気刃突き', mv: 0.18, hits: 1 },
  ],
  jumpAndMountAttacks: [
    { id: 'jumpSlash', name: 'ジャンプ斬り', mv: 0.18, hits: 1 },
    { id: 'jumpSlashUp', name: 'ジャンプ斬り上げ', mv: 0.20, hits: 1 },
    { id: 'jumpSpiritSlash1NoGauge', name: 'ジャンプ気刃斬りⅠ(ゲージ無し)', mv: 0.16, hits: 1 },
    { id: 'jumpSpiritSlash1', name: 'ジャンプ気刃斬りⅠ', mv: 0.30, hits: 1 },
    { id: 'mountAttack1Hit1', name: '騎乗攻撃1 ヒット1', mv: 0.15, hits: 1 },
    { id: 'mountAttack1Hit2', name: '騎乗攻撃1 ヒット2', mv: 0.10, hits: 1 },
    { id: 'mountAttack2', name: '騎乗攻撃2', mv: 0.20, hits: 1 },
    { id: 'dismountAttackHit1', name: '下乗攻撃 ヒット1', mv: 0.30, hits: 1 },
    { id: 'dismountAttackHit2', name: '下乗攻撃 ヒット2', mv: 0.15, hits: 1 },
  ],
};

const App: React.FC = () => {
  const [baseRaw, setBaseRaw] = useState(220);
  const [baseAffinity, setBaseAffinity] = useState(5);
  const [baseDisplayElem, setBaseDisplayElem] = useState(350);
  const [weaponElement, setWeaponElement] = useState('ice');
  const [sharpnessColor, setSharpnessColor] = useState<SharpnessColor>('white');
  const [monster, setMonster] = useState('redaou');
  const [results, setResults] = useState<string | null>(null);

  const [skills, setSkills] = useState(
    Object.entries(skillCategories).flatMap(([, skills]) => skills).reduce((acc, skill) => {
      acc[skill.id] = { enabled: false, level: 0 };
      return acc;
    }, {} as Record<string, { enabled: boolean; level: number }>)
  );

  const [selectedMotions, setSelectedMotions] = useState<Record<string, boolean>>(
    Object.entries(motionCategories).flatMap(([, motions]) => motions).reduce((acc, motion) => {
      acc[motion.id] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [expandedSkillCategory, setExpandedSkillCategory] = useState<string | null>(null);
  const [expandedMotionCategory, setExpandedMotionCategory] = useState<string | null>(null);

  const toggleSkillCategory = (category: string) => {
    setExpandedSkillCategory((prev) => (prev === category ? null : category));
  };

  const toggleMotionCategory = (category: string) => {
    setExpandedMotionCategory((prev) => (prev === category ? null : category));
  };

  const handleSkillToggle = (id: string) => {
    setSkills((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled: !prev[id].enabled },
    }));
  };

  const handleSkillLevelChange = (id: string, level: number) => {
    setSkills((prev) => ({
      ...prev,
      [id]: { ...prev[id], level },
    }));
  };

  const handleMotionToggle = (id: string) => {
    setSelectedMotions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCalculatedSkillEffects = (skillSettings: Record<string, { enabled: boolean; level: number }>) => {
    const effects = {
      rawFlat: 0,
      rawMultiplier: 1.0,
      affinityAdd: 0,
      critBoostMultiplier: 1.25,
      critElemMultiplier: 1.0,
      // ...other effects...
    };
  
    for (const [skillId, { enabled, level }] of Object.entries(skillSettings)) {
      if (!enabled) continue;
  
      switch (skillId) {
        case 'attack':
          effects.rawFlat += [0, 3, 5, 7, 8, 8, 8, 8][level] || 0;
          effects.rawMultiplier *= [1.0, 1.0, 1.0, 1.0, 1.02, 1.04, 1.06, 1.08][level] || 1.0;
          break;
        case 'criticalEye':
          effects.affinityAdd += [0, 4, 8, 12, 16, 20, 25, 30][level] || 0;
          break;
        case 'critBoost':
          effects.critBoostMultiplier = [1.25, 1.3, 1.35, 1.4, 1.45, 1.5][level] || 1.25;
          break;
        case 'critElem':
          effects.critElemMultiplier = [1.0, 1.05, 1.1, 1.15, 1.2, 1.25][level] || 1.0;
          break;
        case 'peakPerformance':
          effects.rawFlat += [0, 3, 6, 10, 15, 20][level] || 0;
          break;
        case 'inverse':
          effects.rawFlat += [0, 10, 15, 25][level] || 0;
          break;
        case 'agitator':
          effects.rawFlat += [0, 4, 8, 12, 16, 20][level] || 0;
          effects.affinityAdd += [0, 3, 5, 7, 10, 15][level] || 0;
          break;
        case 'maximumMight':
          effects.affinityAdd += [0, 10, 20, 30][level] || 0;
          break;
        case 'latentPower':
          effects.affinityAdd += [0, 10, 20, 30, 40, 50][level] || 0;
          break;
        case 'chainCrit':
          effects.rawFlat += [0, 8, 12, 16][level] || 0;
          break;
        case 'offensiveGuard':
          effects.rawFlat += [0, 10, 15, 20][level] || 0;
          break;
        case 'absorption':
          effects.rawFlat += [0, 4, 6, 8][level] || 0;
          break;
        case 'weaknessExploit':
          effects.affinityAdd += [0, 15, 30, 50][level] || 0;
          break;
        default:
          break;
      }
    }
  
    return effects;
  };

  const calculateTotalDamage = () => {
    const selectedMotionData = Object.entries(selectedMotions)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) =>
        Object.values(motionCategories).flat().find((motion) => motion.id === id)
      )
      .filter(Boolean) as { mv: number; hits: number }[];

    if (selectedMotionData.length === 0) {
      setResults('攻撃モーションが選択されていません。');
      return;
    }

    const sharpnessMultiplier: Record<SharpnessColor, { phys: number; elem: number }> = {
      yellow: { phys: 1.0, elem: 0.75 },
      green: { phys: 1.05, elem: 1.0 },
      blue: { phys: 1.2, elem: 1.0625 },
      white: { phys: 1.32, elem: 1.15 },
    };

    const monsterHitzoneData: { [key: string]: { name: string; hitzones: { name: string; raw: number; elem: number; }[]; } } = {
      redaou: {
        name: 'レダウ',
        hitzones: [
          { name: '頭', raw: 60, elem: 20 },
          { name: '胴体', raw: 30, elem: 10 },
          { name: '脚', raw: 40, elem: 15 },
        ],
      },
      arshubeldo: {
        name: 'アルシュベルド',
        hitzones: [
          { name: '頭', raw: 50, elem: 25 },
          { name: '胴体', raw: 35, elem: 15 },
          { name: '脚', raw: 45, elem: 20 },
        ],
      },
    };

    const selectedMonster = monsterHitzoneData[monster];
    if (!selectedMonster) {
      setResults('モンスターが選択されていません。');
      return;
    }

    const sharpness = sharpnessMultiplier[sharpnessColor] || {
      phys: 1.0,
      elem: 1.0,
    };

    // スキル効果を計算
    const skillEffects = getCalculatedSkillEffects(skills);

    const trueRaw = (baseRaw + skillEffects.rawFlat) * skillEffects.rawMultiplier;

    const resultsByHitzone = selectedMonster.hitzones.map((hitzone: Hitzone) => {
      let wexAffinity = 0;

      // 弱点特攻の条件を確認
      if (
        skills.weaknessExploit.enabled &&
        hitzone.raw >= 45 // 弱点特攻の条件: 肉質45以上
      ) {
        wexAffinity = [0, 5, 10, 15, 20, 30][skills.weaknessExploit.level] || 0;
      }

      const effectiveAffinity = Math.min(
        Math.max(baseAffinity + skillEffects.affinityAdd + wexAffinity, 0),
        100
      );

      const totalDamage = selectedMotionData.reduce((acc, motion) => {
        let physDamage =
          trueRaw *
          motion.mv *
          sharpness.phys *
          (hitzone.raw / 100) *
          motion.hits;

        // 心眼の条件を確認
        if (
          skills.mindsEye.enabled &&
          hitzone.raw <= 44 // 心眼の条件: 肉質44以下
        ) {
          physDamage *= [1.0, 1.1, 1.15, 1.3][skills.mindsEye.level] || 1.0;
        }

        const critMultiplier =
          1 + (effectiveAffinity / 100) * (skillEffects.critBoostMultiplier - 1);
        physDamage *= critMultiplier;

        const elemDamage =
          (baseDisplayElem / 10) *
          sharpness.elem *
          (hitzone.elem / 100) *
          motion.hits *
          (1 + (effectiveAffinity / 100) * (skillEffects.critElemMultiplier - 1));

        return acc + physDamage + elemDamage;
      }, 0);

      return {
        hitzone: hitzone.name,
        raw: hitzone.raw,
        elem: hitzone.elem,
        totalDamage: totalDamage.toFixed(2),
      };
    });

    const resultsHtml = resultsByHitzone
      .map(
        (result: { hitzone: string; raw: number; elem: number; totalDamage: string; }) =>
          `<tr><td>${result.hitzone}</td><td>${result.raw}</td><td>${result.elem}</td><td>${result.totalDamage}</td></tr>`
      )
      .join('');

    setResults(
      `<h3>${selectedMonster.name} に対する計算結果</h3>
      <p>使用攻撃力: ${trueRaw.toFixed(2)}, 使用会心率: ${Math.min(
        Math.max(baseAffinity + skillEffects.affinityAdd, 0),
        100
      )}%</p>
      <table>
        <thead>
          <tr>
            <th>部位</th>
            <th>物理肉質</th>
            <th>属性肉質</th>
            <th>合計ダメージ</th>
          </tr>
        </thead>
        <tbody>
          ${resultsHtml}
        </tbody>
      </table>`
    );
  };

  return (
    <div className="container">
      <h2>MH Wilds 太刀 合計ダメージ計算ツール (詳細版)</h2>
      <p>選択した攻撃モーションの連携による合計ダメージを計算します。</p>
      <div className="section-title">武器基本性能</div>
      <div>
        <label htmlFor="baseRaw">武器基礎攻撃力:</label>
        <input
          type="number"
          id="baseRaw"
          value={baseRaw}
          onChange={(e) => setBaseRaw(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="baseAffinity">武器基礎会心率 (%):</label>
        <input
          type="number"
          id="baseAffinity"
          value={baseAffinity}
          onChange={(e) => setBaseAffinity(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="baseDisplayElem">武器表示属性値:</label>
        <input
          type="number"
          id="baseDisplayElem"
          value={baseDisplayElem}
          onChange={(e) => setBaseDisplayElem(Number(e.target.value))}
        />
        <select
          id="weaponElement"
          value={weaponElement}
          onChange={(e) => setWeaponElement(e.target.value)}
        >
          <option value="fire">火</option>
          <option value="water">水</option>
          <option value="thunder">雷</option>
          <option value="ice">氷</option>
          <option value="dragon">龍</option>
        </select>
      </div>
      <div>
        <label htmlFor="sharpnessColor">斬れ味:</label>
        <select
          id="sharpnessColor"
          value={sharpnessColor}
          onChange={(e) => setSharpnessColor(e.target.value as SharpnessColor)}
        >
          <option value="yellow">黄</option>
          <option value="green">緑</option>
          <option value="blue">青</option>
          <option value="white">白</option>
        </select>
      </div>
      <div className="section-title">モンスター選択と肉質情報</div>
      <div>
        <label htmlFor="monsterSelect">モンスター:</label>
        <select
          id="monsterSelect"
          value={monster}
          onChange={(e) => setMonster(e.target.value)}
        >
          <option value="redaou">レダウ</option>
          <option value="arshubeldo">アルシュベルド</option>
        </select>
      </div>
      <div className="section-title">スキル設定</div>
      <p>※チェックで有効/無効を切り替え、ドロップダウンでレベルを選択してください。</p>

      {Object.entries(skillCategories).map(([category, skillsList]) => (
        <div key={category}>
          <div
            className="skill-category-title"
            onClick={() => toggleSkillCategory(category)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>
              {category === 'weaponSkills' && '武器スキル'}
              {category === 'armorSkills' && '防具スキル'}
              {category === 'seriesSkills' && 'シリーズスキル'}
            </span>
            <span>{expandedSkillCategory === category ? '▼' : '▶'}</span>
          </div>
          {expandedSkillCategory === category && (
            <div>
              {skillsList.map((skill) => (
                <div className="skill-item" key={skill.id}>
                  <input
                    type="checkbox"
                    id={`${skill.id}Toggle`}
                    checked={skills[skill.id]?.enabled || false}
                    onChange={() => handleSkillToggle(skill.id)}
                  />
                  <label htmlFor={`${skill.id}Toggle`}>{skill.name}</label>
                  <select
                    id={`${skill.id}LevelSelect`}
                    value={skills[skill.id]?.level || 0}
                    onChange={(e) =>
                      handleSkillLevelChange(skill.id, Number(e.target.value))
                    }
                    disabled={!skills[skill.id]?.enabled}
                  >
                    {Array.from({ length: skill.levels + 1 }, (_, i) => (
                      <option key={i} value={i}>
                        Lv{i}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="section-title">攻撃連携シミュレーション</div>
      <p>連携に含めたい攻撃にチェックを入れてください。</p>
      {Object.entries(motionCategories).map(([category, motions]) => (
        <div key={category}>
          <div
            className="attack-group-title"
            onClick={() => toggleMotionCategory(category)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>
              {category === 'basicAttacks' && '基本攻撃'}
              {category === 'spiritCombos' && '気刃斬り連携'}
              {category === 'iaiAndRedBlade' && '居合・見切り・赤刃'}
              {category === 'specialAttacks' && '特殊系'}
              {category === 'jumpAndMountAttacks' && 'ジャンプ攻撃・騎乗'}
            </span>
            <span>{expandedMotionCategory === category ? '▼' : '▶'}</span>
          </div>
          {expandedMotionCategory === category && (
            <div>
              {motions.map((motion) => (
                <div key={motion.id} className="motion-item">
                  <input
                    type="checkbox"
                    checked={selectedMotions[motion.id]}
                    onChange={() => handleMotionToggle(motion.id)}
                  />
                  <label>{motion.name} (MV: {motion.mv}, Hits: {motion.hits})</label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={calculateTotalDamage}>合計ダメージを計算</button>
      <div id="results" dangerouslySetInnerHTML={{ __html: results || '' }}></div>
    </div>
  );
};

export default App;
