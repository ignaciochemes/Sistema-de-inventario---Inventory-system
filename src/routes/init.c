void main()
{

	Hive ce = CreateHive();
	if ( ce )
		ce.InitOffline();

	Weather weather = g_Game.GetWeather();

	weather.GetOvercast().SetLimits( 0.0 , 1.0 );
	weather.GetRain().SetLimits( 0.0 , 1.0 );
	weather.GetFog().SetLimits( 0.0 , 0.25 );

	weather.GetOvercast().SetForecastChangeLimits( 0.0, 0.2 );
	weather.GetRain().SetForecastChangeLimits( 0.0, 0.1 );
	weather.GetFog().SetForecastChangeLimits( 0.15, 0.45 );

	weather.GetOvercast().SetForecastTimeLimits( 1800 , 1800 );
	weather.GetRain().SetForecastTimeLimits( 600 , 600 );
	weather.GetFog().SetForecastTimeLimits( 1800 , 1800 );

	weather.GetOvercast().Set( Math.RandomFloatInclusive(0.0, 0.3), 0, 0);
	weather.GetRain().Set( Math.RandomFloatInclusive(0.0, 0.2), 0, 0);
	weather.GetFog().Set( Math.RandomFloatInclusive(0.0, 0.1), 0, 0);
	
	weather.SetWindMaximumSpeed(15);
	weather.SetWindFunctionParams(0.1, 0.3, 50);
}

class CustomMission: MissionServer
{	
	void SetRandomHealth(EntityAI itemEnt)
	{
		int rndHlt = Math.RandomInt(40,100);
		itemEnt.SetHealth("","",rndHlt);
	}

	override PlayerBase CreateCharacter(PlayerIdentity identity, vector pos, ParamsReadContext ctx, string characterName)
	{
		Entity playerEnt;
		playerEnt = GetGame().CreatePlayer(identity, characterName, pos, 0, "NONE");//Creates random player
		Class.CastTo(m_player, playerEnt);
		
		GetGame().SelectPlayer(identity, m_player);
		
		return m_player;
	}
	
	override void StartingEquipSetup(PlayerBase player, bool clothesChosen)
	{

		player.RemoveAllItems();

		EntityAI itemEnt;
		ItemBase itemBs;
		
		player.GetInventory().CreateInInventory("TTSKOPants");
		player.GetInventory().CreateInInventory("TTsKOJacket_Camo");
		player.GetInventory().CreateInInventory("HuntingBag");
		player.GetInventory().CreateInInventory("Sneakers_Gray");
		player.GetInventory().CreateInInventory("PlateCarrierComplete");
		
		itemEnt = player.GetInventory().CreateInInventory("Rag");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(6);
		SetRandomHealth(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("M4_Suppressor");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("M4_RISHndgrd");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("M4_CQBBttstck");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("ACOGOptic");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("Mag_CMAG_40Rnd_Black");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("Mag_CMAG_40Rnd_Black");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_556x45_20Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_556x45_20Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_556x45_20Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_556x45_20Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("M4A1_Black");
		itemBs = ItemBase.Cast(itemEnt);
		itemBs.SetQuantity(1);

		itemEnt = player.GetInventory().CreateInInventory("Rice");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Rice");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Apple");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Apple");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Apple");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Apple");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Apple");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("FNX45");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("PistolSuppressor");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_45ACP_25rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("AmmoBox_45ACP_25rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Mag_FNX45_15Rnd");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("FirstAidKit");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Morphine");
		itemBs = ItemBase.Cast(itemEnt);
		
		itemEnt = player.GetInventory().CreateInInventory("Morphine");
		itemBs = ItemBase.Cast(itemEnt);
	}
};
  
Mission CreateCustomMission(string path)
{
	return new CustomMission();
}