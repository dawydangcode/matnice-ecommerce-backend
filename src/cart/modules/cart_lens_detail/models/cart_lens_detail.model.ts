export class CartLensDetailModel {
  public readonly id: number;
  public readonly cartFrameId: number;
  public readonly lensId: number | undefined;
  public readonly rightEyeSphere: number | undefined;
  public readonly rightEyeCylinder: number | undefined;
  public readonly rightEyeAxis: number | undefined;
  public readonly leftEyeSphere: number | undefined;
  public readonly leftEyeCylinder: number | undefined;
  public readonly leftEyeAxis: number | undefined;
  public readonly pdLeft: number | undefined;
  public readonly pdRight: number | undefined;
  public readonly lensType: string | undefined;
  public readonly lensQuality: string;
  public readonly refractionIndex: number;
  public readonly upgradeHardCoating: boolean;
  public readonly upgradeAntiReflection: boolean;
  public readonly upgradeUvProtection: boolean;
  public readonly upgradeBlueLight: boolean;
  public readonly upgradeLotusEffect: boolean;
  public readonly upgradeSmartFocus: boolean;
  public readonly upgradeTransition: boolean;
  public readonly upgradeProgressive: boolean;
  public readonly upgradeHardCoatingPrice: number;
  public readonly upgradeAntiReflectionPrice: number;
  public readonly upgradeUvProtectionPrice: number;
  public readonly upgradeBluelightPrice: number;
  public readonly upgradeLotusEffectPrice: number;
  public readonly upgradeSmartFocusPrice: number;
  public readonly upgradeTransitionPrice: number;
  public readonly upgradeProgressivePrice: number;
  public readonly totalUpgradesPrice: number;
  public readonly lensPrice: number;
  public readonly lensMaterial: string | undefined;
  public readonly lensThickness: string | undefined;
  public readonly tintColor: string | undefined;
  public readonly tintDensity: string | undefined;
  public readonly prescriptionNotes: string | undefined;
  public readonly lensNotes: string | undefined;
  public readonly manufacturingNotes: string | undefined;
  public readonly fieldOfVision: string | undefined;
  public readonly addLeft: number | undefined;
  public readonly addRight: number | undefined;
  public readonly createdAt: Date;
  public readonly createdBy: number;
  public readonly updatedAt: Date;
  public readonly updatedBy: number;
  public readonly deletedAt: Date | undefined;
  public readonly deletedBy: number | undefined;

  constructor(
    id: number,
    cartFrameId: number,
    lensId: number | undefined,
    rightEyeSphere: number | undefined,
    rightEyeCylinder: number | undefined,
    rightEyeAxis: number | undefined,
    leftEyeSphere: number | undefined,
    leftEyeCylinder: number | undefined,
    leftEyeAxis: number | undefined,
    pdLeft: number | undefined,
    pdRight: number | undefined,
    lensType: string | undefined,
    lensQuality: string,
    refractionIndex: number,
    upgradeHardCoating: boolean,
    upgradeAntiReflection: boolean,
    upgradeUvProtection: boolean,
    upgradeBlueLight: boolean,
    upgradeLotusEffect: boolean,
    upgradeSmartFocus: boolean,
    upgradeTransition: boolean,
    upgradeProgressive: boolean,
    upgradeHardCoatingPrice: number,
    upgradeAntiReflectionPrice: number,
    upgradeUvProtectionPrice: number,
    upgradeBluelightPrice: number,
    upgradeLotusEffectPrice: number,
    upgradeSmartFocusPrice: number,
    upgradeTransitionPrice: number,
    upgradeProgressivePrice: number,
    totalUpgradesPrice: number,
    lensPrice: number,
    lensMaterial: string | undefined,
    lensThickness: string | undefined,
    tintColor: string | undefined,
    tintDensity: string | undefined,
    prescriptionNotes: string | undefined,
    lensNotes: string | undefined,
    manufacturingNotes: string | undefined,
    fieldOfVision: string | undefined,
    addLeft: number | undefined,
    addRight: number | undefined,
    createdAt: Date,
    createdBy: number,
    updatedAt: Date,
    updatedBy: number,
    deletedAt: Date | undefined,
    deletedBy: number | undefined,
  ) {
    this.id = id;
    this.cartFrameId = cartFrameId;
    this.lensId = lensId;
    this.rightEyeSphere = rightEyeSphere;
    this.rightEyeCylinder = rightEyeCylinder;
    this.rightEyeAxis = rightEyeAxis;
    this.leftEyeSphere = leftEyeSphere;
    this.leftEyeCylinder = leftEyeCylinder;
    this.leftEyeAxis = leftEyeAxis;
    this.pdLeft = pdLeft;
    this.pdRight = pdRight;
    this.lensType = lensType;
    this.lensQuality = lensQuality;
    this.refractionIndex = refractionIndex;
    this.upgradeHardCoating = upgradeHardCoating;
    this.upgradeAntiReflection = upgradeAntiReflection;
    this.upgradeUvProtection = upgradeUvProtection;
    this.upgradeBlueLight = upgradeBlueLight;
    this.upgradeLotusEffect = upgradeLotusEffect;
    this.upgradeSmartFocus = upgradeSmartFocus;
    this.upgradeTransition = upgradeTransition;
    this.upgradeProgressive = upgradeProgressive;
    this.upgradeHardCoatingPrice = upgradeHardCoatingPrice;
    this.upgradeAntiReflectionPrice = upgradeAntiReflectionPrice;
    this.upgradeUvProtectionPrice = upgradeUvProtectionPrice;
    this.upgradeBluelightPrice = upgradeBluelightPrice;
    this.upgradeLotusEffectPrice = upgradeLotusEffectPrice;
    this.upgradeSmartFocusPrice = upgradeSmartFocusPrice;
    this.upgradeTransitionPrice = upgradeTransitionPrice;
    this.upgradeProgressivePrice = upgradeProgressivePrice;
    this.totalUpgradesPrice = totalUpgradesPrice;
    this.lensPrice = lensPrice;
    this.lensMaterial = lensMaterial;
    this.lensThickness = lensThickness;
    this.tintColor = tintColor;
    this.tintDensity = tintDensity;
    this.prescriptionNotes = prescriptionNotes;
    this.lensNotes = lensNotes;
    this.manufacturingNotes = manufacturingNotes;
    this.fieldOfVision = fieldOfVision;
    this.addLeft = addLeft;
    this.addRight = addRight;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt;
    this.deletedBy = deletedBy;
  }
}
